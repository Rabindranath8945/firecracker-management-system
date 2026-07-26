import mongoose, { Types } from "mongoose";

import SalesRepository from "../repositories/sales.repository.js";
import InventoryService from "../../inventory/index.js";
import NotificationEngine from "../../notification/engines/notification.engine.js";

import { buildSale } from "../builders/sale.builder.js";

import {
  generateInvoiceNumber,
  generateSaleNumber,
} from "../helpers/invoice-generator.js";

import { validatePayment } from "../helpers/payment-validator.js";

import { CreateSaleInput } from "../validators/sales.validator.js";

export async function createSaleWorkflow(
  data: CreateSaleInput,
  userId: string,
) {
  const sequence = await SalesRepository.getNextSequence();

  const saleNo = generateSaleNumber(sequence);

  const invoiceNo = generateInvoiceNumber(sequence);

  validatePayment(data.payment, data.paidAmount);

  const { saleItems, totals } = await buildSale(data.items);

  const sale = await SalesRepository.create({
    ...data,

    saleNo,

    invoiceNo,

    customer: data.customer ? new Types.ObjectId(data.customer) : undefined,

    items: saleItems,

    subtotal: totals.subtotal,

    discount: totals.discount,

    taxAmount: totals.taxAmount,

    grandTotal: totals.grandTotal,

    createdBy: new Types.ObjectId(userId),
  });

  for (const item of saleItems) {
    await InventoryService.decreaseStock(
      item.product.toString(),
      item.quantity,
      {
        type: "SALE",
        referenceId: sale._id.toString(),
        referenceNo: sale.saleNo,
        createdBy: userId,
      },
    );
  }

  const createdSale = await SalesRepository.findById(sale.id);

  if (createdSale) {
    try {
      await NotificationEngine.saleCreated({
        userId,

        saleId: createdSale.id,

        invoiceNo: createdSale.invoiceNo,

        customer:
          createdSale.customer instanceof Types.ObjectId
            ? "Walk-in Customer"
            : (createdSale.customer?.name ?? "Walk-in Customer"),

        total: createdSale.grandTotal,
      });
    } catch (error) {
      console.error("Failed to create sale notification:", error);
    }
  }

  return {
    sale: createdSale ?? sale,
    totals,
  };
}
