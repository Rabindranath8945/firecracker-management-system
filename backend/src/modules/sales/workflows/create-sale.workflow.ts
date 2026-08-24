import mongoose, { Types } from "mongoose";

import SalesRepository from "../repositories/sales.repository.js";
import InventoryService from "../../inventory/index.js";
import NotificationEngine from "../../notification/engines/notification.engine.js";
import CustomerRepository from "../../customer/repositories/customer.repository.js";
import SettingsRepository from "../../settings/repositories/settings.repository.js";
import UserService from "../../user/services/user.service.js";

import { buildSale } from "../builders/sale.builder.js";

import { generateSequenceCode } from "../../../common/utils/generate-code.js";

import { validatePayment } from "../helpers/payment-validator.js";

import type { CreateSaleInput } from "../validators/sales.validator.js";

export async function createSaleWorkflow(
  data: CreateSaleInput,
  userId: string,
) {
  if (!Types.ObjectId.isValid(userId)) {
    throw new Error("Invalid user.");
  }
  const businessId = await UserService.getCurrentBusiness(userId);

  if (!businessId) {
    throw new Error("No current business selected.");
  }

  const session = await mongoose.startSession();

  try {
    const transactionResult = await session.withTransaction(async () => {
      /* ------------------------------------------------------------------ */
      /* Generate Sale Number                                               */
      /* ------------------------------------------------------------------ */

      const salePrefix = await SettingsRepository.getNumberingPrefix(
        userId,
        "sale",
      );

      const saleCodes = await SalesRepository.getSaleCodes(session);

      const saleNo = generateSequenceCode(
        saleCodes
          .map((sale) => sale.saleNo)
          .filter((code): code is string => Boolean(code)),
        salePrefix,
      );

      /* ------------------------------------------------------------------ */
      /* Generate Invoice Number From Settings                              */
      /* ------------------------------------------------------------------ */

      const invoiceNo =
        await SettingsRepository.generateNextInvoiceNumber(userId);

      /* ------------------------------------------------------------------ */
      /* Build Sale Items & Totals                                          */
      /* ------------------------------------------------------------------ */

      const { saleItems, totals } = await buildSale(
        data.items,
        data.discount,
        userId,
      );

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
          businessId: new Types.ObjectId(businessId),

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
