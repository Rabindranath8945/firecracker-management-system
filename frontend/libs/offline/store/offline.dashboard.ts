import { getDatabase } from "../api/database";

import type {
  DashboardSummary,
  SalesChartItem,
  LowStockProduct,
  RecentActivity,
  BusinessInsight,
} from "@/features/dashboard/types/dashboard.type";

/* -------------------------------------------------------------------------- */
/* DATE HELPERS                                                               */
/* -------------------------------------------------------------------------- */

function startOfDay(date: Date): string {
  const value = new Date(date);

  value.setHours(0, 0, 0, 0);

  return value.toISOString();
}

function startOfWeek(date: Date): string {
  const value = new Date(date);

  value.setHours(0, 0, 0, 0);

  const day = value.getDay();

  const difference = day === 0 ? 6 : day - 1;

  value.setDate(value.getDate() - difference);

  return value.toISOString();
}

function startOfMonth(date: Date): string {
  const value = new Date(date);

  value.setDate(1);
  value.setHours(0, 0, 0, 0);

  return value.toISOString();
}

/* -------------------------------------------------------------------------- */
/* BUSINESS SETTINGS                                                          */
/* -------------------------------------------------------------------------- */

async function getBusinessSettings(): Promise<{
  name: string;
  ownerName: string;
} | null> {
  const db = await getDatabase();

  const result = await db.query(
    `
      SELECT value
      FROM app_settings
      WHERE key = ?
      LIMIT 1
    `,
    ["business-settings"],
  );

  const value = result.values?.[0]?.value;

  if (!value) {
    return null;
  }

  try {
    const settings = JSON.parse(String(value)) as {
      business?: {
        name?: string;
        ownerName?: string;
      };
    };

    return {
      name: settings.business?.name ?? "",
      ownerName: settings.business?.ownerName ?? "",
    };
  } catch {
    return null;
  }
}

/* -------------------------------------------------------------------------- */
/* DASHBOARD                                                                  */
/* -------------------------------------------------------------------------- */

export async function getOfflineDashboard(): Promise<DashboardSummary> {
  const db = await getDatabase();

  const now = new Date();

  const today = startOfDay(now);
  const week = startOfWeek(now);
  const month = startOfMonth(now);

  /* ------------------------------------------------------------------------ */
  /* BUSINESS                                                                 */
  /* ------------------------------------------------------------------------ */

  const settings = await getBusinessSettings();

  /* ------------------------------------------------------------------------ */
  /* TODAY SALES                                                              */
  /* ------------------------------------------------------------------------ */

  const todaySalesResult = await db.query(
    `
      SELECT
        COALESCE(SUM(grand_total), 0) AS total
      FROM sales
      WHERE sale_date >= ?
    `,
    [today],
  );

  const todaySales = Number(todaySalesResult.values?.[0]?.total ?? 0);

  /* ------------------------------------------------------------------------ */
  /* TODAY PROFIT                                                             */
  /* ------------------------------------------------------------------------ */

  const todayProfitResult = await db.query(
    `
      SELECT
        COALESCE(
          SUM(
            (
              si.selling_price - COALESCE(p.purchase_price, 0)
            ) * si.quantity
            - COALESCE(si.discount, 0)
          ),
          0
        ) AS profit
      FROM sale_items si
      INNER JOIN sales s
        ON s.id = si.sale_id
      LEFT JOIN products p
        ON p.id = si.product_id
      WHERE s.sale_date >= ?
    `,
    [today],
  );

  const todayProfit = Number(todayProfitResult.values?.[0]?.profit ?? 0);

  /* ------------------------------------------------------------------------ */
  /* MONTHLY REVENUE                                                          */
  /* ------------------------------------------------------------------------ */

  const monthlyRevenueResult = await db.query(
    `
      SELECT
        COALESCE(SUM(grand_total), 0) AS total
      FROM sales
      WHERE sale_date >= ?
    `,
    [month],
  );

  const monthlyRevenue = Number(monthlyRevenueResult.values?.[0]?.total ?? 0);

  /* ------------------------------------------------------------------------ */
  /* OUTSTANDING CUSTOMER BALANCE                                             */
  /* ------------------------------------------------------------------------ */

  const outstandingResult = await db.query(`
    SELECT
      COALESCE(
        SUM(
          CASE
            WHEN opening_balance > 0
            THEN opening_balance
            ELSE 0
          END
        ),
        0
      ) AS total
    FROM customers
    WHERE is_active = 1
  `);

  const outstandingPayments = Number(outstandingResult.values?.[0]?.total ?? 0);

  /* ------------------------------------------------------------------------ */
  /* CUSTOMERS                                                                */
  /* ------------------------------------------------------------------------ */

  const customersResult = await db.query(`
    SELECT COUNT(*) AS count
    FROM customers
    WHERE is_active = 1
  `);

  const totalCustomers = Number(customersResult.values?.[0]?.count ?? 0);

  /* ------------------------------------------------------------------------ */
  /* LOW STOCK                                                                */
  /* ------------------------------------------------------------------------ */

  const lowStockResult = await db.query(`
    SELECT
      id,
      name,
      stock,
      minimum_stock
    FROM products
    WHERE is_active = 1
      AND stock <= minimum_stock
    ORDER BY stock ASC, name ASC
  `);

  const lowStockProducts: LowStockProduct[] = (lowStockResult.values ?? []).map(
    (row) => ({
      id: String(row.id),
      name: String(row.name),
      stock: Number(row.stock ?? 0),
      minStock: Number(row.minimum_stock ?? 0),
    }),
  );

  /* ------------------------------------------------------------------------ */
  /* WEEKLY SALES                                                             */
  /* ------------------------------------------------------------------------ */

  const weeklySalesResult = await db.query(
    `
      SELECT
        DATE(sale_date) AS day,
        COALESCE(SUM(grand_total), 0) AS sales
      FROM sales
      WHERE sale_date >= ?
      GROUP BY DATE(sale_date)
      ORDER BY DATE(sale_date) ASC
    `,
    [week],
  );

  const weeklySales = Number(
    (
      await db.query(
        `
          SELECT
            COALESCE(SUM(grand_total), 0) AS total
          FROM sales
          WHERE sale_date >= ?
        `,
        [week],
      )
    ).values?.[0]?.total ?? 0,
  );

  const salesChart: SalesChartItem[] = (weeklySalesResult.values ?? []).map(
    (row) => ({
      day: String(row.day),
      sales: Number(row.sales ?? 0),
    }),
  );

  /* ------------------------------------------------------------------------ */
  /* SALES GROWTH                                                             */
  /* ------------------------------------------------------------------------ */

  const previousWeekStart = new Date(week);

  previousWeekStart.setDate(previousWeekStart.getDate() - 7);

  const previousWeekEnd = new Date(week);

  const previousWeekResult = await db.query(
    `
      SELECT
        COALESCE(SUM(grand_total), 0) AS total
      FROM sales
      WHERE sale_date >= ?
        AND sale_date < ?
    `,
    [previousWeekStart.toISOString(), previousWeekEnd.toISOString()],
  );

  const previousWeekSales = Number(previousWeekResult.values?.[0]?.total ?? 0);

  const salesGrowth =
    previousWeekSales > 0
      ? ((weeklySales - previousWeekSales) / previousWeekSales) * 100
      : weeklySales > 0
        ? 100
        : 0;

  /* ------------------------------------------------------------------------ */
  /* RECENT SALES                                                             */
  /* ------------------------------------------------------------------------ */

  const recentSalesResult = await db.query(`
    SELECT
      id,
      sale_no,
      grand_total,
      sale_date
    FROM sales
    ORDER BY sale_date DESC, id DESC
    LIMIT 5
  `);

  /* ------------------------------------------------------------------------ */
  /* RECENT PURCHASES                                                         */
  /* ------------------------------------------------------------------------ */

  const recentPurchasesResult = await db.query(`
    SELECT
      id,
      purchase_no,
      grand_total,
      purchase_date
    FROM purchases
    WHERE is_active = 1
    ORDER BY purchase_date DESC, id DESC
    LIMIT 5
  `);

  const recentActivities: RecentActivity[] = [];

  for (const row of recentSalesResult.values ?? []) {
    recentActivities.push({
      id: String(row.id),
      title: `Sale ${String(row.sale_no)}`,
      subtitle: "Sales transaction",
      value: `₹${Number(row.grand_total ?? 0).toFixed(2)}`,
      time: String(row.sale_date),
      type: "SALE",
    });
  }

  for (const row of recentPurchasesResult.values ?? []) {
    recentActivities.push({
      id: String(row.id),
      title: `Purchase ${String(row.purchase_no)}`,
      subtitle: "Purchase transaction",
      value: `₹${Number(row.grand_total ?? 0).toFixed(2)}`,
      time: String(row.purchase_date),
      type: "PURCHASE",
    });
  }

  recentActivities.sort(
    (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime(),
  );

  const limitedActivities = recentActivities.slice(0, 10);

  /* ------------------------------------------------------------------------ */
  /* INSIGHTS                                                                 */
  /* ------------------------------------------------------------------------ */

  const insights: BusinessInsight[] = [];

  if (lowStockProducts.length > 0) {
    insights.push({
      id: "offline-low-stock",
      title: "Low stock alert",
      description: `${lowStockProducts.length} product${
        lowStockProducts.length === 1 ? "" : "s"
      } need attention.`,
      type: "WARNING",
    });
  }

  if (salesGrowth > 0) {
    insights.push({
      id: "offline-sales-growth",
      title: "Sales are growing",
      description: `Sales are up ${salesGrowth.toFixed(
        1,
      )}% compared with the previous week.`,
      type: "SUCCESS",
    });
  }

  if (salesGrowth < 0) {
    insights.push({
      id: "offline-sales-decline",
      title: "Sales declined",
      description: `Sales are down ${Math.abs(salesGrowth).toFixed(
        1,
      )}% compared with the previous week.`,
      type: "SUGGESTION",
    });
  }

  /* ------------------------------------------------------------------------ */
  /* RETURN                                                                   */
  /* ------------------------------------------------------------------------ */

  return {
    business: {
      name: settings?.name ?? "",
      businessId: "",
    },

    owner: {
      name: settings?.ownerName ?? "",
      role: "Owner",
    },

    todaySales,

    todayProfit,

    monthlyRevenue,

    outstandingPayments,

    totalCustomers,

    lowStock: lowStockProducts.length,

    weeklySales,

    salesGrowth,

    salesChart,

    lowStockProducts,

    recentActivities: limitedActivities,

    insights,
  };
}
