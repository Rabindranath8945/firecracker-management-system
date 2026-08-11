import mongoose, { Types } from "mongoose";

import SalesRepository from "../repositories/sales.repository.js";
import InventoryService from "../../inventory/index.js";
import NotificationEngine from "../../notification/engines/notification.engine.js";
import CustomerRepository from "../../customer/repositories/customer.repository.js";

import { buildSale } from "../builders/sale.builder.js";

import {
  generateInvoiceNumber,
  generateSaleNumber,
} from "../helpers/invoice-generator.js";

import { validatePayment } from "../helpers/payment-validator.js";

import type { CreateSaleInput } from "../validators/sales.validator.js";

export async function createSaleWorkflow(
  data: CreateSaleInput,
  userId: string,
) {
  const session = await mongoose.startSession();

  try {
    const transactionResult = await session.withTransaction(async () => {
      /* ------------------------------------------------------------------ */
      /* Generate Sale & Invoice Numbers                                    */
      /* ------------------------------------------------------------------ */

      const saleCodes = await SalesRepository.getSaleCodes(session);

      const sequence =
        saleCodes.length === 0
          ? 1
          : Math.max(
              ...saleCodes.map(
                (sale) => Number(sale.saleNo.replace("SAL-", "")) || 0,
              ),
            ) + 1;

      const saleNo = generateSaleNumber(sequence);

      const invoiceNo = generateInvoiceNumber(sequence);

      /* ------------------------------------------------------------------ */
      /* Build Sale Items & Totals                                          */
      /* ------------------------------------------------------------------ */

      const { saleItems, totals } = await buildSale(data.items, data.discount);

      /* ------------------------------------------------------------------ */
      /* Paid Amount                                                        */
      /* ------------------------------------------------------------------ */

      const paidAmount = Math.max(0, data.paidAmount);

      if (paidAmount > totals.grandTotal) {
        throw new Error("Paid amount cannot be greater than grand total.");
      }

      /* ------------------------------------------------------------------ */
      /* Due Amount                                                         */
      /* ------------------------------------------------------------------ */

      const dueAmount = Math.max(0, totals.grandTotal - paidAmount);

      /* ------------------------------------------------------------------ */
      /* Payment Status                                                     */
      /* ------------------------------------------------------------------ */

      const paymentStatus =
        paidAmount >= totals.grandTotal
          ? "PAID"
          : paidAmount > 0
            ? "PARTIAL"
            : "DUE";

      /* ------------------------------------------------------------------ */
      /* Payment Breakdown                                                  */
      /* ------------------------------------------------------------------ */

      const payment = {
        method: data.paymentMethod,

        cash: data.paymentMethod === "CASH" ? paidAmount : 0,

        upi: data.paymentMethod === "UPI" ? paidAmount : 0,

        card: data.paymentMethod === "CARD" ? paidAmount : 0,

        bank: data.paymentMethod === "BANK" ? paidAmount : 0,

        /*
         * For CREDIT sale, paidAmount should normally be 0.
         *
         * The actual outstanding amount is stored
         * in sale.dueAmount.
         */
        credit: data.paymentMethod === "CREDIT" ? paidAmount : 0,
      };

      /* ------------------------------------------------------------------ */
      /* Validate Payment                                                   */
      /* ------------------------------------------------------------------ */

      validatePayment(payment, paidAmount);

      /* ------------------------------------------------------------------ */
      /* Create Sale                                                        */
      /* ------------------------------------------------------------------ */

      const createdSale = await SalesRepository.create(
        {
          saleNo,

          invoiceNo,

          saleDate: new Date(),

          customer: data.customer
            ? new Types.ObjectId(data.customer)
            : undefined,

          items: saleItems,

          subtotal: totals.subtotal,

          discount: totals.discount,

          taxAmount: totals.taxAmount,

          grandTotal: totals.grandTotal,

          paidAmount,

          dueAmount,

          payment,

          paymentStatus,

          notes: data.notes,

          createdBy: new Types.ObjectId(userId),
        },
        session,
      );

      /* ------------------------------------------------------------------ */
      /* Update Inventory                                                   */
      /* ------------------------------------------------------------------ */

      await Promise.all(
        saleItems.map((item) =>
          InventoryService.decreaseStock(
            item.product.toString(),
            item.quantity,
            {
              type: "SALE",

              referenceId: createdSale._id.toString(),

              referenceNo: saleNo,

              createdBy: userId,
            },
            session,
          ),
        ),
      );

      /* ------------------------------------------------------------------ */
      /* Update Customer Due                                                */
      /* ------------------------------------------------------------------ */
      /*
       * IMPORTANT:
       *
       * Only the NEW SALE'S due is added here.
       *
       * Example:
       *
       * Existing customer balance = ₹900
       * New sale                  = ₹295
       * Paid                      = ₹0
       *
       * New customer balance      = ₹1,195
       *
       * If CASH sale is fully paid:
       *
       * Existing balance = ₹900
       * New sale due      = ₹0
       * Customer balance  = ₹900
       *
       * Previous due collection is handled separately
       * by CustomerPaymentService.
       */

      if (data.customer && dueAmount > 0) {
        await CustomerRepository.increaseBalance(
          data.customer,
          dueAmount,
          session,
        );
      }

      /* ------------------------------------------------------------------ */
      /* Transaction Result                                                 */
      /* ------------------------------------------------------------------ */

      return {
        createdSale,
        totals,
      };
    });

    /* -------------------------------------------------------------------- */
    /* Transaction Check                                                    */
    /* -------------------------------------------------------------------- */

    if (!transactionResult) {
      throw new Error("Sale transaction failed.");
    }

    const { createdSale, totals } = transactionResult;

    /* -------------------------------------------------------------------- */
    /* Load Complete Sale                                                   */
    /* -------------------------------------------------------------------- */

    const sale = await SalesRepository.findById(createdSale.id);

    /* -------------------------------------------------------------------- */
    /* Notification                                                         */
    /* -------------------------------------------------------------------- */

    if (sale) {
      queueMicrotask(() => {
        void NotificationEngine.saleCreated({
          userId,

          saleId: sale.id,

          invoiceNo: sale.invoiceNo,

          customer:
            sale.customer &&
            typeof sale.customer === "object" &&
            "name" in sale.customer
              ? sale.customer.name
              : "Walk-in Customer",

          total: sale.grandTotal,
        }).catch((error) => {
          console.error("Sale notification failed:", error);
        });
      });
    }

    /* -------------------------------------------------------------------- */
    /* Response                                                             */
    /* -------------------------------------------------------------------- */

    return {
      sale: sale ?? createdSale,
      totals,
    };
  } finally {
    await session.endSession();
  }
}
