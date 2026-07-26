import { PdfService, type PdfOptions } from "../../../common/pdf/index.js";

import SalesRepository from "../repositories/sales.repository.js";

class InvoiceService {
  async generatePdf(saleId: string) {
    const sale = await SalesRepository.findInvoiceById(saleId);

    if (!sale) {
      throw new Error("Sale not found.");
    }

    const options: PdfOptions = {
      title: "TAX INVOICE",

      company: {
        name: "Firecracker Management System",

        address: "Business Address",

        phone: "9876543210",

        email: "info@example.com",

        gstNo: "GSTIN",
      },

      customer: sale.customer
        ? {
            name: sale.customer.name,

            mobile: sale.customer.mobile,

            address: sale.customer.address,

            gstNo: sale.customer.gstNo,
          }
        : undefined,

      columns: [
        {
          title: "#",
          key: "sl",
          width: 30,
        },
        {
          title: "Product",
          key: "name",
          width: 180,
        },
        {
          title: "Qty",
          key: "qty",
          width: 50,
          align: "right",
        },
        {
          title: "Rate",
          key: "rate",
          width: 80,
          align: "right",
        },
        {
          title: "GST",
          key: "gst",
          width: 60,
          align: "right",
        },
        {
          title: "Total",
          key: "total",
          width: 90,
          align: "right",
        },
      ],

      rows: sale.items.map((item, index) => ({
        sl: index + 1,

        name: item.productName,

        qty: item.quantity,

        rate: item.sellingPrice.toFixed(2),

        gst: `${item.tax}%`,

        total: item.total.toFixed(2),
      })),

      summary: [
        {
          label: "Subtotal",
          value: `₹${sale.subtotal.toFixed(2)}`,
        },
        {
          label: "Discount",
          value: `₹${sale.discount.toFixed(2)}`,
        },
        {
          label: "Tax",
          value: `₹${sale.taxAmount.toFixed(2)}`,
        },
        {
          label: "Grand Total",
          value: `₹${sale.grandTotal.toFixed(2)}`,
        },
        {
          label: "Paid",
          value: `₹${sale.paidAmount.toFixed(2)}`,
        },
        {
          label: "Due",
          value: `₹${sale.dueAmount.toFixed(2)}`,
        },
      ],

      notes: sale.notes,
    };

    return PdfService.generate(options);
  }
}

export default new InvoiceService();
