"use client";

import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

import type { Sale } from "../types/Sales.types";

interface BusinessSettings {
  name?: string;
  ownerName?: string;
  logo?: string;
  businessType?: string;
  gstNo?: string;
  panNo?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

interface InvoiceSettings {
  prefix?: string;
  nextNumber?: number;
  footer?: string;
  terms?: string;
  showLogo?: boolean;
  showGST?: boolean;
  showCustomerMobile?: boolean;
  showCustomerAddress?: boolean;
}

interface TaxSettings {
  enabled?: boolean;
  defaultGST?: number;
  taxType?: string;
  currency?: string;
  currencySymbol?: string;
}

export interface SaleInvoiceProps {
  sale: Sale;
  business: BusinessSettings;
  invoice?: InvoiceSettings;
  tax?: TaxSettings;
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#F5F3FF",
    padding: 28,
    fontFamily: "Helvetica",
    color: "#171326",
  },

  sheet: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 28,
    minHeight: "100%",
  },

  topAccent: {
    height: 7,
    backgroundColor: "#6D28D9",
    borderRadius: 5,
    marginBottom: 22,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  businessSection: {
    flexDirection: "row",
    width: "62%",
  },

  logo: {
    width: 54,
    height: 54,
    borderRadius: 12,
    objectFit: "contain",
    marginRight: 12,
  },

  logoFallback: {
    width: 54,
    height: 54,
    borderRadius: 12,
    backgroundColor: "#7C3AED",
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    paddingTop: 14,
    marginRight: 12,
  },

  businessName: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#20153F",
    marginBottom: 5,
  },

  businessText: {
    fontSize: 8.5,
    color: "#6B6478",
    marginBottom: 3,
  },

  invoiceSection: {
    width: "32%",
    alignItems: "flex-end",
  },

  invoiceBadge: {
    backgroundColor: "#EDE9FE",
    color: "#6D28D9",
    fontSize: 8,
    fontWeight: "bold",
    paddingVertical: 5,
    paddingHorizontal: 9,
    borderRadius: 20,
    marginBottom: 8,
  },

  invoiceNumber: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#171326",
  },

  invoiceMeta: {
    fontSize: 8.5,
    color: "#6B6478",
    marginTop: 3,
  },

  divider: {
    height: 1,
    backgroundColor: "#DDD6FE",
    marginVertical: 20,
  },

  infoRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },

  infoCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E9E3F5",
    borderRadius: 10,
    padding: 13,
    backgroundColor: "#FCFBFF",
  },

  sectionLabel: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#7C3AED",
    textTransform: "uppercase",
    marginBottom: 7,
  },

  customerName: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#171326",
    marginBottom: 4,
  },

  normalText: {
    fontSize: 8.5,
    color: "#5F586C",
    marginBottom: 3,
  },

  table: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 9,
    overflow: "hidden",
    marginTop: 4,
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#6D28D9",
    color: "#FFFFFF",
    paddingVertical: 9,
    paddingHorizontal: 7,
  },

  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 7,
    borderBottomWidth: 1,
    borderBottomColor: "#F0EDF5",
  },

  tableRowLast: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 7,
  },

  colNo: {
    width: "6%",
  },

  colProduct: {
    width: "39%",
  },

  colQty: {
    width: "11%",
    textAlign: "center",
  },

  colRate: {
    width: "15%",
    textAlign: "right",
  },

  colTax: {
    width: "12%",
    textAlign: "right",
  },

  colAmount: {
    width: "17%",
    textAlign: "right",
  },

  headerText: {
    fontSize: 7.5,
    fontWeight: "bold",
  },

  rowText: {
    fontSize: 8.5,
    color: "#292235",
  },

  productName: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#20153F",
  },

  productMeta: {
    fontSize: 7,
    color: "#8A8394",
    marginTop: 3,
  },

  lowerSection: {
    flexDirection: "row",
    marginTop: 22,
    gap: 20,
  },

  notesBox: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: "#FAF8FF",
    borderWidth: 1,
    borderColor: "#E9E3F5",
    padding: 14,
  },

  summaryBox: {
    width: "45%",
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E9E3F5",
    padding: 14,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  summaryLabel: {
    fontSize: 8.5,
    color: "#6B6478",
  },

  summaryValue: {
    fontSize: 8.5,
    color: "#171326",
    fontWeight: "bold",
  },

  totalDivider: {
    height: 1.5,
    backgroundColor: "#6D28D9",
    marginVertical: 8,
  },

  grandTotalLabel: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#20153F",
  },

  grandTotalValue: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#6D28D9",
  },

  paidValue: {
    color: "#059669",
  },

  dueValue: {
    color: "#DC2626",
  },

  paymentBox: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#A7F3D0",
    backgroundColor: "#ECFDF5",
    borderRadius: 10,
    padding: 13,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  paymentTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#047857",
    marginBottom: 4,
  },

  paymentText: {
    fontSize: 8,
    color: "#4B6B61",
  },

  paidBadge: {
    backgroundColor: "#D1FAE5",
    color: "#047857",
    fontSize: 8,
    fontWeight: "bold",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
  },

  footer: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    alignItems: "center",
  },

  footerMain: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#20153F",
    marginBottom: 4,
  },

  footerText: {
    fontSize: 7.5,
    color: "#8A8394",
    textAlign: "center",
    marginBottom: 4,
  },

  generatedText: {
    fontSize: 6.5,
    color: "#B0A8BC",
    letterSpacing: 1.5,
    marginTop: 5,
  },
});

function money(amount: number, symbol: string): string {
  return `${symbol}${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getBusinessLocation(business: BusinessSettings): string {
  return [business.address, business.city, business.state, business.pincode]
    .filter(Boolean)
    .join(", ");
}

export default function SaleInvoicePDF({
  sale,
  business,
  invoice,
  tax,
}: SaleInvoiceProps) {
  const currency = tax?.currencySymbol ?? "₹";

  const customer = sale.customer;

  const showGST = invoice?.showGST ?? true;

  const showCustomerMobile = invoice?.showCustomerMobile ?? true;

  const showCustomerAddress = invoice?.showCustomerAddress ?? true;

  const location = getBusinessLocation(business);

  const totalQuantity = sale.items.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  return (
    <Document
      title={sale.invoiceNo}
      author={business.name ?? ""}
      subject={`Invoice ${sale.invoiceNo}`}
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.sheet}>
          <View style={styles.topAccent} />

          {/* ---------------------------------------------------------- */}
          {/* BUSINESS HEADER */}
          {/* ---------------------------------------------------------- */}

          <View style={styles.header}>
            <View style={styles.businessSection}>
              {invoice?.showLogo && business.logo ? (
                <Image src={business.logo} style={styles.logo} />
              ) : (
                <Text style={styles.logoFallback}>
                  {(business.name ?? "B").charAt(0).toUpperCase()}
                </Text>
              )}

              <View>
                <Text style={styles.businessName}>
                  {business.name || "Business"}
                </Text>

                {business.ownerName ? (
                  <Text style={styles.businessText}>{business.ownerName}</Text>
                ) : null}

                {location ? (
                  <Text style={styles.businessText}>{location}</Text>
                ) : null}

                {business.phone ? (
                  <Text style={styles.businessText}>{business.phone}</Text>
                ) : null}

                {business.email ? (
                  <Text style={styles.businessText}>{business.email}</Text>
                ) : null}
              </View>
            </View>

            <View style={styles.invoiceSection}>
              <Text style={styles.invoiceBadge}>TAX INVOICE</Text>

              <Text style={styles.invoiceNumber}>{sale.invoiceNo}</Text>

              <Text style={styles.invoiceMeta}>Sale No: {sale.saleNo}</Text>

              {business.gstNo && showGST ? (
                <Text style={styles.invoiceMeta}>GSTIN: {business.gstNo}</Text>
              ) : null}
            </View>
          </View>

          <View style={styles.divider} />

          {/* ---------------------------------------------------------- */}
          {/* CUSTOMER + INVOICE DETAILS */}
          {/* ---------------------------------------------------------- */}

          <View style={styles.infoRow}>
            <View style={styles.infoCard}>
              <Text style={styles.sectionLabel}>Bill To</Text>

              <Text style={styles.customerName}>
                {customer?.name || "Walk-in Customer"}
              </Text>

              {showCustomerMobile && customer?.mobile ? (
                <Text style={styles.normalText}>Mobile: {customer.mobile}</Text>
              ) : null}

              {showCustomerAddress && customer?.address ? (
                <Text style={styles.normalText}>{customer.address}</Text>
              ) : null}

              {customer?.email ? (
                <Text style={styles.normalText}>{customer.email}</Text>
              ) : null}
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.sectionLabel}>Invoice Details</Text>

              <Text style={styles.normalText}>
                Date: {formatDate(sale.saleDate)}
              </Text>

              <Text style={styles.normalText}>
                Payment: {sale.payment.method}
              </Text>

              <Text style={styles.normalText}>
                Status: {sale.paymentStatus}
              </Text>
            </View>
          </View>

          {/* ---------------------------------------------------------- */}
          {/* ITEMS */}
          {/* ---------------------------------------------------------- */}

          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.colNo, styles.headerText]}>#</Text>

              <Text style={[styles.colProduct, styles.headerText]}>
                PRODUCT
              </Text>

              <Text style={[styles.colQty, styles.headerText]}>QTY</Text>

              <Text style={[styles.colRate, styles.headerText]}>RATE</Text>

              <Text style={[styles.colTax, styles.headerText]}>GST</Text>

              <Text style={[styles.colAmount, styles.headerText]}>AMOUNT</Text>
            </View>

            {sale.items.map((item, index) => {
              const isLast = index === sale.items.length - 1;

              return (
                <View
                  key={`${item.product}-${index}`}
                  style={isLast ? styles.tableRowLast : styles.tableRow}
                >
                  <Text style={[styles.colNo, styles.rowText]}>
                    {index + 1}
                  </Text>

                  <View style={styles.colProduct}>
                    <Text style={styles.productName}>{item.productName}</Text>

                    <Text style={styles.productMeta}>
                      {item.productCode}
                      {item.unit ? ` • ${item.unit}` : ""}
                      {item.category?.name ? ` • ${item.category.name}` : ""}
                    </Text>
                  </View>

                  <Text style={[styles.colQty, styles.rowText]}>
                    {item.quantity}
                  </Text>

                  <Text style={[styles.colRate, styles.rowText]}>
                    {money(item.sellingPrice, currency)}
                  </Text>

                  <Text style={[styles.colTax, styles.rowText]}>
                    {showGST ? `${item.tax}%` : "-"}
                  </Text>

                  <Text style={[styles.colAmount, styles.rowText]}>
                    {money(item.total, currency)}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* ---------------------------------------------------------- */}
          {/* NOTES + TOTALS */}
          {/* ---------------------------------------------------------- */}

          <View style={styles.lowerSection}>
            <View style={styles.notesBox}>
              <Text style={styles.sectionLabel}>Notes</Text>

              <Text style={styles.normalText}>
                {sale.notes || invoice?.footer || ""}
              </Text>

              {invoice?.terms ? (
                <Text style={[styles.normalText, { marginTop: 10 }]}>
                  {invoice.terms}
                </Text>
              ) : null}
            </View>

            <View style={styles.summaryBox}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Quantity</Text>

                <Text style={styles.summaryValue}>{totalQuantity}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>

                <Text style={styles.summaryValue}>
                  {money(sale.subtotal, currency)}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Discount</Text>

                <Text style={styles.summaryValue}>
                  {money(sale.discount, currency)}
                </Text>
              </View>

              {tax?.enabled !== false ? (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Tax / GST</Text>

                  <Text style={styles.summaryValue}>
                    {money(sale.taxAmount, currency)}
                  </Text>
                </View>
              ) : null}

              <View style={styles.totalDivider} />

              <View style={styles.summaryRow}>
                <Text style={styles.grandTotalLabel}>GRAND TOTAL</Text>

                <Text style={styles.grandTotalValue}>
                  {money(sale.grandTotal, currency)}
                </Text>
              </View>

              <View style={[styles.summaryRow, { marginTop: 8 }]}>
                <Text style={styles.summaryLabel}>Paid Amount</Text>

                <Text style={[styles.summaryValue, styles.paidValue]}>
                  {money(sale.paidAmount, currency)}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Due Amount</Text>

                <Text
                  style={[
                    styles.summaryValue,
                    sale.dueAmount > 0 ? styles.dueValue : styles.paidValue,
                  ]}
                >
                  {money(sale.dueAmount, currency)}
                </Text>
              </View>
            </View>
          </View>

          {/* ---------------------------------------------------------- */}
          {/* PAYMENT STATUS */}
          {/* ---------------------------------------------------------- */}

          <View style={styles.paymentBox}>
            <View>
              <Text style={styles.paymentTitle}>
                {sale.paymentStatus === "PAID"
                  ? "PAYMENT PAID"
                  : "PAYMENT STATUS"}
              </Text>

              <Text style={styles.paymentText}>
                Payment Method: {sale.payment.method}
              </Text>
            </View>

            <Text style={styles.paidBadge}>{sale.paymentStatus}</Text>
          </View>

          {/* ---------------------------------------------------------- */}
          {/* FOOTER */}
          {/* ---------------------------------------------------------- */}

          <View style={styles.footer}>
            {invoice?.footer ? (
              <Text style={styles.footerMain}>{invoice.footer}</Text>
            ) : null}

            {business.website ? (
              <Text style={styles.footerText}>{business.website}</Text>
            ) : null}

            {business.panNo ? (
              <Text style={styles.footerText}>PAN: {business.panNo}</Text>
            ) : null}

            <Text style={styles.generatedText}>COMPUTER GENERATED INVOICE</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
