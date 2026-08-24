import api from "@/lib/api";

import {
  createOfflineSale,
  getOfflineSale,
  getOfflineSales,
  updateOfflineSale,
  deleteOfflineSale,
  type CreateOfflineSaleInput,
} from "@/libs/offline/store/offline.sales";

import { addToSyncQueue } from "@/libs/offline/sync/sync.queue";

import type {
  Sale,
  SaleFormData,
  SalesSummary,
  SalesQueryParams,
} from "../types/Sales.types";

class SalesService {
  async getSummary(): Promise<SalesSummary> {
    const response = await api.get("/sales/summary");

    return response.data.data;
  }

  async getNextCode(): Promise<string> {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      return this.generateOfflineSaleNo();
    }

    const response = await api.get("/sales/next-code");

    return response.data.data.saleNo;
  }

  async getSales(params: SalesQueryParams = {}): Promise<Sale[]> {
    /*
     * ------------------------------------------------------------------------
     * OFFLINE
     * ------------------------------------------------------------------------
     */

    if (typeof navigator !== "undefined" && !navigator.onLine) {
      const offlineSales = await getOfflineSales();

      return offlineSales.map((sale) => ({
        _id: sale.id,

        saleNo: sale.saleNo,

        invoiceNo: sale.saleNo,

        customer: sale.customerId
          ? {
              _id: sale.customerId,
              name: "Customer",
            }
          : null,

        saleDate: sale.saleDate,

        items: (sale.items ?? []).map((item) => ({
          product: item.productId,

          productCode: "",

          productName: "",

          unit: "",

          stock: 0,

          tax: item.gstRate,

          quantity: item.quantity,

          sellingPrice: item.sellingPrice,

          discount: item.discount,

          total: item.total,

          profit: 0,
        })),

        subtotal: sale.subtotal,

        discount: sale.discount,

        taxAmount: sale.taxAmount,

        grandTotal: sale.grandTotal,

        paidAmount: sale.paidAmount,

        dueAmount: sale.dueAmount,

        payment: {
          method: sale.paymentMethod,

          cash: sale.paymentMethod === "CASH" ? sale.paidAmount : 0,

          upi: sale.paymentMethod === "UPI" ? sale.paidAmount : 0,

          card: sale.paymentMethod === "CARD" ? sale.paidAmount : 0,

          bank: sale.paymentMethod === "BANK" ? sale.paidAmount : 0,

          credit: sale.paymentMethod === "CREDIT" ? sale.paidAmount : 0,
        },

        paymentStatus: sale.paymentStatus,

        ...(sale.notes
          ? {
              notes: sale.notes,
            }
          : {}),

        createdAt: sale.createdAt,

        updatedAt: sale.updatedAt,
      }));
    }

    /*
     * ------------------------------------------------------------------------
     * ONLINE
     * ------------------------------------------------------------------------
     */

    const response = await api.get("/sales", {
      params,
    });

    return response.data.data.items;
  }

  async getSale(id: string): Promise<Sale> {
    /*
     * ------------------------------------------------------------------------
     * OFFLINE
     * ------------------------------------------------------------------------
     */

    if (typeof navigator !== "undefined" && !navigator.onLine) {
      const offlineSale = await getOfflineSale(id);

      if (!offlineSale) {
        throw new Error("Sale not found offline.");
      }

      return {
        _id: offlineSale.id,

        saleNo: offlineSale.saleNo,

        invoiceNo: offlineSale.saleNo,

        customer: offlineSale.customerId
          ? {
              _id: offlineSale.customerId,
              name: "Customer",
            }
          : null,

        saleDate: offlineSale.saleDate,

        items: (offlineSale.items ?? []).map((item) => ({
          product: item.productId,

          productCode: "",

          productName: "",

          unit: "",

          stock: 0,

          tax: item.gstRate,

          quantity: item.quantity,

          sellingPrice: item.sellingPrice,

          discount: item.discount,

          total: item.total,

          profit: 0,
        })),

        subtotal: offlineSale.subtotal,

        discount: offlineSale.discount,

        taxAmount: offlineSale.taxAmount,

        grandTotal: offlineSale.grandTotal,

        paidAmount: offlineSale.paidAmount,

        dueAmount: offlineSale.dueAmount,

        payment: {
          method: offlineSale.paymentMethod,

          cash:
            offlineSale.paymentMethod === "CASH" ? offlineSale.paidAmount : 0,

          upi: offlineSale.paymentMethod === "UPI" ? offlineSale.paidAmount : 0,

          card:
            offlineSale.paymentMethod === "CARD" ? offlineSale.paidAmount : 0,

          bank:
            offlineSale.paymentMethod === "BANK" ? offlineSale.paidAmount : 0,

          credit:
            offlineSale.paymentMethod === "CREDIT" ? offlineSale.paidAmount : 0,
        },

        paymentStatus: offlineSale.paymentStatus,

        ...(offlineSale.notes
          ? {
              notes: offlineSale.notes,
            }
          : {}),

        createdAt: offlineSale.createdAt,

        updatedAt: offlineSale.updatedAt,
      };
    }

    /*
     * ------------------------------------------------------------------------
     * ONLINE
     * ------------------------------------------------------------------------
     */

    const response = await api.get(`/sales/${id}`);

    return response.data.data;
  }

  async getNextInvoiceNumber(): Promise<string> {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      return this.generateOfflineSaleNo();
    }

    const response = await api.get("/sales/next-code");

    return response.data.data.invoiceNumber;
  }

  /* ------------------------------------------------------------------------ */
  /* CREATE SALE                                                              */
  /* ------------------------------------------------------------------------ */

  async createSale(data: SaleFormData): Promise<Sale> {
    /*
     * ONLINE
     */
    if (typeof navigator === "undefined" || navigator.onLine) {
      const response = await api.post("/sales", data);

      return response.data.data.sale;
    }

    /*
     * OFFLINE
     */
    const payload = await this.buildOfflinePayload(data);

    const offlineSale = await createOfflineSale(payload);

    await addToSyncQueue("SALE", "CREATE", payload, offlineSale.id);

    /*
     * Convert the offline sale into the
     * existing Sale shape expected by
     * PaymentPage and other Sales screens.
     */
    return {
      _id: offlineSale.id,

      saleNo: offlineSale.saleNo,

      invoiceNo: offlineSale.saleNo,

      ...(offlineSale.customerId
        ? {
            customer: {
              _id: offlineSale.customerId,
              name: "Customer",
            },
          }
        : {
            customer: null,
          }),

      saleDate: offlineSale.saleDate,

      items: data.items.map((item) => ({
        product: item.product,

        productCode: "",

        productName: "",

        unit: "",

        stock: 0,

        tax: 0,

        quantity: item.quantity,

        sellingPrice: item.price,

        discount: 0,

        total: item.quantity * item.price,

        profit: 0,
      })),

      subtotal: offlineSale.subtotal,

      discount: offlineSale.discount,

      taxAmount: offlineSale.taxAmount,

      grandTotal: offlineSale.grandTotal,

      paidAmount: offlineSale.paidAmount,

      dueAmount: offlineSale.dueAmount,

      payment: {
        method: offlineSale.paymentMethod,

        cash: offlineSale.paymentMethod === "CASH" ? offlineSale.paidAmount : 0,

        upi: offlineSale.paymentMethod === "UPI" ? offlineSale.paidAmount : 0,

        card: offlineSale.paymentMethod === "CARD" ? offlineSale.paidAmount : 0,

        bank: offlineSale.paymentMethod === "BANK" ? offlineSale.paidAmount : 0,

        credit:
          offlineSale.paymentMethod === "CREDIT" ? offlineSale.paidAmount : 0,
      },

      paymentStatus: offlineSale.paymentStatus,

      ...(offlineSale.notes
        ? {
            notes: offlineSale.notes,
          }
        : {}),

      createdAt: offlineSale.createdAt,

      updatedAt: offlineSale.updatedAt,
    };
  }

  /* ------------------------------------------------------------------------ */
  /* BUILD OFFLINE PAYLOAD                                                    */
  /* ------------------------------------------------------------------------ */

  private async buildOfflinePayload(
    data: SaleFormData,
  ): Promise<CreateOfflineSaleInput> {
    const db = await this.getOfflineDatabase();

    const now = new Date().toISOString();

    let subtotal = 0;
    let itemDiscount = 0;
    let taxAmount = 0;

    const items: CreateOfflineSaleInput["items"] = [];

    for (const item of data.items) {
      const result = await db.query(
        `
          SELECT
            id,
            selling_price,
            tax
          FROM products
          WHERE id = ?
          LIMIT 1
        `,
        [item.product],
      );

      const product = result.values?.[0];

      if (!product) {
        throw new Error(`Product not available offline: ${item.product}`);
      }

      const sellingPrice = Number(product.selling_price ?? item.price);

      const gstRate = Number(product.tax ?? 0);

      const lineSubtotal = item.quantity * sellingPrice;

      /*
       * SaleFormData only contains the
       * invoice-level discount.
       *
       * Therefore item discount = 0.
       */

      const lineDiscount = 0;

      const taxableAmount = Math.max(0, lineSubtotal - lineDiscount);

      const lineTax = (taxableAmount * gstRate) / 100;

      const lineTotal = taxableAmount + lineTax;

      subtotal += lineSubtotal;

      itemDiscount += lineDiscount;

      taxAmount += lineTax;

      items.push({
        productId: item.product,

        quantity: item.quantity,

        sellingPrice,

        discount: lineDiscount,

        gstRate,

        taxAmount: lineTax,

        subtotal: lineSubtotal,

        total: lineTotal,
      });
    }

    /*
     * Invoice-level discount.
     */

    const discount = Math.max(0, Math.min(subtotal + taxAmount, data.discount));

    const grandTotal = Math.max(
      0,
      subtotal - itemDiscount - discount + taxAmount,
    );

    const paidAmount = Math.max(0, Math.min(data.paidAmount, grandTotal));

    const dueAmount = Math.max(0, grandTotal - paidAmount);

    const paymentStatus =
      paidAmount >= grandTotal ? "PAID" : paidAmount > 0 ? "PARTIAL" : "DUE";

    return {
      saleNo: this.generateOfflineSaleNo(),

      ...(data.customer
        ? {
            customerId: data.customer,
          }
        : {}),

      saleDate: now,

      items,

      subtotal,

      discount,

      taxAmount,

      grandTotal,

      paidAmount,

      dueAmount,

      paymentMethod: data.paymentMethod,

      paymentStatus,

      payments:
        paidAmount > 0
          ? [
              {
                paymentMethod: data.paymentMethod,
                amount: paidAmount,
              },
            ]
          : [],

      ...(data.notes?.trim()
        ? {
            notes: data.notes.trim(),
          }
        : {}),
    };
  }

  /* ------------------------------------------------------------------------ */
  /* SQLITE                                                                   */
  /* ------------------------------------------------------------------------ */

  private async getOfflineDatabase() {
    const { getDatabase } = await import("@/libs/offline/api/database");

    return getDatabase();
  }

  /* ------------------------------------------------------------------------ */
  /* OFFLINE SALE NUMBER                                                      */
  /* ------------------------------------------------------------------------ */

  private generateOfflineSaleNo(): string {
    return `OFF-${Date.now()}`;
  }

  /* ------------------------------------------------------------------------ */
  /* UPDATE                                                                   */
  /* ------------------------------------------------------------------------ */

  async updateSale(id: string, data: SaleFormData): Promise<Sale> {
    /*
     * ----------------------------------------------------------------------
     * OFFLINE
     * ----------------------------------------------------------------------
     */

    if (typeof navigator !== "undefined" && !navigator.onLine) {
      const existingSale = await getOfflineSale(id);

      if (!existingSale) {
        throw new Error("Sale not found offline.");
      }

      const offlineInput: CreateOfflineSaleInput = {
        id,

        saleNo: existingSale.saleNo,

        ...(data.customer
          ? {
              customerId: data.customer,
            }
          : {}),

        saleDate: existingSale.saleDate,

        items: data.items.map((item) => ({
          productId: item.product,

          quantity: item.quantity,

          sellingPrice: item.price,

          discount: 0,

          gstRate: 0,

          taxAmount: 0,

          subtotal: item.quantity * item.price,

          total: item.quantity * item.price,
        })),

        subtotal: data.items.reduce(
          (sum, item) => sum + item.quantity * item.price,
          0,
        ),

        discount: data.discount,

        taxAmount: 0,

        grandTotal:
          data.items.reduce(
            (sum, item) => sum + item.quantity * item.price,
            0,
          ) - data.discount,

        paidAmount: data.paidAmount,

        dueAmount: Math.max(
          0,
          data.items.reduce(
            (sum, item) => sum + item.quantity * item.price,
            0,
          ) -
            data.discount -
            data.paidAmount,
        ),

        paymentMethod: data.paymentMethod,

        paymentStatus:
          data.paidAmount <= 0
            ? "DUE"
            : data.paidAmount >=
                data.items.reduce(
                  (sum, item) => sum + item.quantity * item.price,
                  0,
                ) -
                  data.discount
              ? "PAID"
              : "PARTIAL",

        ...(data.notes
          ? {
              notes: data.notes,
            }
          : {}),
      };

      const updatedSale = await updateOfflineSale(id, offlineInput);

      /*
       * Queue the UPDATE for synchronization.
       */

      await addToSyncQueue("SALE", "UPDATE", data, id);

      return {
        _id: updatedSale.id,

        saleNo: updatedSale.saleNo,

        invoiceNo: updatedSale.saleNo,

        customer: updatedSale.customerId
          ? {
              _id: updatedSale.customerId,
              name: "Customer",
            }
          : null,

        saleDate: updatedSale.saleDate,

        items: (updatedSale.items ?? []).map((item) => ({
          product: item.productId,

          productCode: "",

          productName: "",

          unit: "",

          stock: 0,

          tax: item.gstRate,

          quantity: item.quantity,

          sellingPrice: item.sellingPrice,

          discount: item.discount,

          total: item.total,

          profit: 0,
        })),

        subtotal: updatedSale.subtotal,

        discount: updatedSale.discount,

        taxAmount: updatedSale.taxAmount,

        grandTotal: updatedSale.grandTotal,

        paidAmount: updatedSale.paidAmount,

        dueAmount: updatedSale.dueAmount,

        payment: {
          method: updatedSale.paymentMethod,

          cash:
            updatedSale.paymentMethod === "CASH" ? updatedSale.paidAmount : 0,

          upi: updatedSale.paymentMethod === "UPI" ? updatedSale.paidAmount : 0,

          card:
            updatedSale.paymentMethod === "CARD" ? updatedSale.paidAmount : 0,

          bank:
            updatedSale.paymentMethod === "BANK" ? updatedSale.paidAmount : 0,

          credit:
            updatedSale.paymentMethod === "CREDIT" ? updatedSale.paidAmount : 0,
        },

        paymentStatus: updatedSale.paymentStatus,

        ...(updatedSale.notes
          ? {
              notes: updatedSale.notes,
            }
          : {}),

        createdAt: updatedSale.createdAt,

        updatedAt: updatedSale.updatedAt,
      };
    }

    /*
     * ----------------------------------------------------------------------
     * ONLINE
     * ----------------------------------------------------------------------
     */

    const response = await api.put(`/sales/${id}`, data);

    return response.data.data;
  }

  /* ------------------------------------------------------------------------ */
  /* DELETE                                                                   */
  /* ------------------------------------------------------------------------ */

  async deleteSale(id: string): Promise<void> {
    if (!id) {
      throw new Error("Sale ID is required.");
    }

    /*
     * ----------------------------------------------------------------------
     * OFFLINE
     * ----------------------------------------------------------------------
     */

    if (typeof navigator !== "undefined" && !navigator.onLine) {
      const existingSale = await getOfflineSale(id);

      if (!existingSale) {
        throw new Error("Sale not found offline.");
      }

      /*
       * Remove sale from SQLite.
       *
       * This also restores:
       * - product stock
       * - customer due
       * - sale items
       * - payments
       */

      await deleteOfflineSale(id);

      /*
       * Queue DELETE for the backend.
       */

      await addToSyncQueue(
        "SALE",
        "DELETE",
        {
          saleId: id,
        },
        id,
      );

      return;
    }

    /*
     * ----------------------------------------------------------------------
     * ONLINE
     * ----------------------------------------------------------------------
     */

    await api.delete(`/sales/${id}`);
  }
}

export default new SalesService();
