import { Types } from "mongoose";

import PurchaseRepository from "../repositories/purchase.repository.js";
import InventoryService from "../../inventory/index.js";
import NotificationEngine from "../../notification/engines/notification.engine.js";

import SupplierRepository from "../../supplier/repositories/supplier.repository.js";
import SupplierPaymentRepository from "../../supplier/repositories/supplier-payment.repository.js";

import ProductRepository from "../../product/repositories/product.repository.js";
import SettingsRepository from "../../settings/repositories/settings.repository.js";

import {
  createPurchaseSchema,
  updatePurchaseSchema,
} from "../validators/purchase.validator.js";

import { generateSequenceCode } from "../../../common/utils/generate-code.js";

class PurchaseService {
  /* ---------------------------------------------------------------------- */
  /* CREATE PURCHASE                                                        */
  /* ---------------------------------------------------------------------- */

  async create(data: unknown, userId: string) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user.");
    }

    const validated = createPurchaseSchema.parse(data);

    /* ------------------------------------------------------------------ */
    /* Load Tax Settings                                                  */
    /* ------------------------------------------------------------------ */

    const settings = await SettingsRepository.findByUserId(userId);

    if (!settings) {
      throw new Error("Settings not found for the authenticated user.");
    }

    const gstEnabled = settings.tax?.enabled ?? false;

    const defaultGST = Number(settings.tax?.defaultGST ?? 0);

    /* ------------------------------------------------------------------ */
    /* Generate Purchase Number                                           */
    /* ------------------------------------------------------------------ */

    const purchasePrefix = await SettingsRepository.getNumberingPrefix(
      userId,
      "purchase",
    );

    const purchases = await PurchaseRepository.getPurchaseCodes();

    const purchaseNo = generateSequenceCode(
      purchases
        .map((purchase) => purchase.purchaseNo)
        .filter((code): code is string => Boolean(code)),
      purchasePrefix,
    );

    /* ------------------------------------------------------------------ */
    /* Generate Invoice Number                                            */
    /* ------------------------------------------------------------------ */

    const invoices = await PurchaseRepository.getInvoiceCodes();

    const invoiceNo = generateSequenceCode(
      invoices
        .map((invoice) => invoice.invoiceNo)
        .filter((value): value is string => Boolean(value)),
      "INV",
    );

    /* ------------------------------------------------------------------ */
    /* Calculate Purchase Totals                                          */
    /* ------------------------------------------------------------------ */

    let subtotal = 0;
    let discount = 0;
    let taxAmount = 0;

    const items = [];

    for (const item of validated.items) {
      const product = await ProductRepository.findById(item.product);

      if (!product) {
        throw new Error(`Product not found: ${item.product}`);
      }

      /*
       * Product GST has priority.
       *
       * If GST is disabled globally, use 0.
       *
       * If product has a configured GST rate, use it.
       *
       * Otherwise use the global default GST.
       */
      const gstRate = gstEnabled
        ? product.tax > 0
          ? product.tax
          : defaultGST
        : 0;

      const itemSubtotal = item.quantity * item.purchasePrice;

      const discountAmount = itemSubtotal * (item.discount / 100);

      const taxableAmount = itemSubtotal - discountAmount;

      const itemTax = taxableAmount * (gstRate / 100);

      const itemTotal = taxableAmount + itemTax;

      subtotal += itemSubtotal;
      discount += discountAmount;
      taxAmount += itemTax;

      items.push({
        product: new Types.ObjectId(item.product),

        quantity: item.quantity,

        purchasePrice: item.purchasePrice,

        sellingPrice: item.sellingPrice,

        discount: item.discount,

        /*
         * Snapshot GST rate.
         */
        gstRate,

        /*
         * Snapshot calculated GST amount.
         */
        tax: itemTax,

        subtotal: itemSubtotal,

        total: itemTotal,
      });
    }

    /* ------------------------------------------------------------------ */
    /* Grand Total                                                        */
    /* ------------------------------------------------------------------ */

    const grandTotal =
      subtotal - discount + taxAmount + validated.transportCharge;

    /* ------------------------------------------------------------------ */
    /* Supplier Previous Due                                              */
    /* ------------------------------------------------------------------ */

    const supplierBalance = await SupplierRepository.getBalance(
      validated.supplier,
    );

    const previousDue = Math.max(0, Number(supplierBalance.currentDue ?? 0));

    /* ------------------------------------------------------------------ */
    /* Payment Calculation                                                */
    /* ------------------------------------------------------------------ */

    const enteredPayment = Math.max(0, Number(validated.paidAmount ?? 0));

    const totalPayable = grandTotal + previousDue;

    const acceptedPayment = Math.min(enteredPayment, totalPayable);

    const paidAmount = Math.min(acceptedPayment, grandTotal);

    const previousDuePayment = Math.min(
      Math.max(0, acceptedPayment - grandTotal),
      previousDue,
    );

    const dueAmount = Math.max(0, grandTotal - paidAmount);

    let paymentStatus: "PAID" | "PARTIAL" | "DUE";

    if (paidAmount <= 0) {
      paymentStatus = "DUE";
    } else if (paidAmount >= grandTotal) {
      paymentStatus = "PAID";
    } else {
      paymentStatus = "PARTIAL";
    }

    /* ------------------------------------------------------------------ */
    /* Prepare Purchase Data                                              */
    /* ------------------------------------------------------------------ */

    const purchaseData = {
      purchaseNo,

      invoiceNo,

      supplier: new Types.ObjectId(validated.supplier),

      purchaseDate: validated.purchaseDate,

      ...(validated.dueDate
        ? {
            dueDate: validated.dueDate,
          }
        : {}),

      items,

      subtotal,

      taxAmount,

      discount,

      transportCharge: validated.transportCharge,

      grandTotal,

      paidAmount,

      dueAmount,

      paymentMethod: validated.paymentMethod,

      paymentStatus,

      notes: validated.notes ?? "",

      createdBy: new Types.ObjectId(userId),
    };

    /* ------------------------------------------------------------------ */
    /* Create Purchase                                                     */
    /* ------------------------------------------------------------------ */

    const purchase = await PurchaseRepository.create(purchaseData);

    /* ------------------------------------------------------------------ */
    /* Previous Due Payment                                               */
    /* ------------------------------------------------------------------ */

    if (previousDuePayment > 0) {
      await SupplierPaymentRepository.create({
        supplier: new Types.ObjectId(validated.supplier),

        amount: previousDuePayment,

        paymentMethod: validated.paymentMethod,

        paymentType: "PREVIOUS_DUE",

        paymentDate: validated.purchaseDate,

        referencePurchase: purchase._id,

        notes: `Previous supplier due payment against ${purchase.purchaseNo}`,

        createdBy: new Types.ObjectId(userId),
      });
    }

    /* ------------------------------------------------------------------ */
    /* Increase Inventory Stock                                           */
    /* ------------------------------------------------------------------ */

    for (const item of validated.items) {
      await InventoryService.increaseStock(item.product, item.quantity, {
        type: "PURCHASE",

        referenceId: purchase._id.toString(),

        referenceNo: purchase.purchaseNo,

        createdBy: userId,
      });
    }

    /* ------------------------------------------------------------------ */
    /* Fetch Populated Purchase                                           */
    /* ------------------------------------------------------------------ */

    const createdPurchase = await PurchaseRepository.findById(
      purchase._id.toString(),
    );

    if (!createdPurchase) {
      throw new Error("Purchase created but could not be retrieved.");
    }

    /* ------------------------------------------------------------------ */
    /* Notification                                                       */
    /* ------------------------------------------------------------------ */

    const supplierName =
      createdPurchase.supplier instanceof Types.ObjectId
        ? "Unknown Supplier"
        : createdPurchase.supplier.name;

    await NotificationEngine.purchaseCreated({
      userId,

      purchaseId: createdPurchase._id.toString(),

      purchaseNo: createdPurchase.purchaseNo,

      supplier: supplierName,

      total: createdPurchase.grandTotal,
    });

    return createdPurchase;
  }

  /* ---------------------------------------------------------------------- */
  /* GET ALL                                                               */
  /* ---------------------------------------------------------------------- */

  async getAll(options: {
    page?: number;
    limit?: number;
    search?: string;
    supplier?: string;
    paymentStatus?: string;
    fromDate?: Date;
    toDate?: Date;
    isActive?: boolean;
    sort?: string;
    order?: "asc" | "desc";
  }) {
    return PurchaseRepository.findAll(options);
  }

  /* ---------------------------------------------------------------------- */
  /* GET BY ID                                                             */
  /* ---------------------------------------------------------------------- */

  async getById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid purchase id.");
    }

    const purchase = await PurchaseRepository.findById(id);

    if (!purchase) {
      throw new Error("Purchase not found.");
    }

    return purchase;
  }

  /* ---------------------------------------------------------------------- */
  /* UPDATE                                                                */
  /* ---------------------------------------------------------------------- */

  async update(id: string, data: unknown, userId: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid purchase id.");
    }

    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user.");
    }

    const validated = updatePurchaseSchema.parse(data);

    const updateData: Record<string, unknown> = {
      updatedBy: new Types.ObjectId(userId),
    };

    if (validated.supplier) {
      updateData.supplier = new Types.ObjectId(validated.supplier);
    }

    if (validated.purchaseDate) {
      updateData.purchaseDate = validated.purchaseDate;
    }

    if (validated.dueDate) {
      updateData.dueDate = validated.dueDate;
    }

    if (validated.transportCharge !== undefined) {
      updateData.transportCharge = validated.transportCharge;
    }

    if (validated.paymentMethod) {
      updateData.paymentMethod = validated.paymentMethod;
    }

    if (validated.notes !== undefined) {
      updateData.notes = validated.notes;
    }

    /* ------------------------------------------------------------------ */
    /* Recalculate Items                                                  */
    /* ------------------------------------------------------------------ */

    if (validated.items) {
      const settings = await SettingsRepository.findByUserId(userId);

      if (!settings) {
        throw new Error("Settings not found for the authenticated user.");
      }

      const gstEnabled = settings.tax?.enabled ?? false;

      const defaultGST = Number(settings.tax?.defaultGST ?? 0);

      let subtotal = 0;
      let discount = 0;
      let taxAmount = 0;

      const items = [];

      for (const item of validated.items) {
        const product = await ProductRepository.findById(item.product);

        if (!product) {
          throw new Error(`Product not found: ${item.product}`);
        }

        const gstRate = gstEnabled
          ? product.tax > 0
            ? product.tax
            : defaultGST
          : 0;

        const itemSubtotal = item.quantity * item.purchasePrice;

        const discountAmount = itemSubtotal * (item.discount / 100);

        const taxableAmount = itemSubtotal - discountAmount;

        const itemTax = taxableAmount * (gstRate / 100);

        const itemTotal = taxableAmount + itemTax;

        subtotal += itemSubtotal;
        discount += discountAmount;
        taxAmount += itemTax;

        items.push({
          product: new Types.ObjectId(item.product),

          quantity: item.quantity,

          purchasePrice: item.purchasePrice,

          sellingPrice: item.sellingPrice,

          discount: item.discount,

          gstRate,

          tax: itemTax,

          subtotal: itemSubtotal,

          total: itemTotal,
        });
      }

      updateData.items = items;

      updateData.subtotal = subtotal;

      updateData.discount = discount;

      updateData.taxAmount = taxAmount;

      const transportCharge = validated.transportCharge ?? 0;

      const grandTotal = subtotal - discount + taxAmount + transportCharge;

      updateData.grandTotal = grandTotal;

      const paidAmount = Math.min(
        Math.max(0, validated.paidAmount ?? 0),
        grandTotal,
      );

      const dueAmount = Math.max(0, grandTotal - paidAmount);

      updateData.paidAmount = paidAmount;

      updateData.dueAmount = dueAmount;

      updateData.paymentStatus =
        paidAmount <= 0 ? "DUE" : paidAmount >= grandTotal ? "PAID" : "PARTIAL";
    } else if (validated.paidAmount !== undefined) {
      const existingPurchase = await PurchaseRepository.findById(id);

      if (!existingPurchase) {
        throw new Error("Purchase not found.");
      }

      const grandTotal = existingPurchase.grandTotal;

      const paidAmount = Math.min(
        Math.max(0, validated.paidAmount),
        grandTotal,
      );

      const dueAmount = Math.max(0, grandTotal - paidAmount);

      updateData.paidAmount = paidAmount;

      updateData.dueAmount = dueAmount;

      updateData.paymentStatus =
        paidAmount <= 0 ? "DUE" : paidAmount >= grandTotal ? "PAID" : "PARTIAL";
    }

    /* ------------------------------------------------------------------ */
    /* Update Purchase                                                     */
    /* ------------------------------------------------------------------ */

    const purchase = await PurchaseRepository.update(id, updateData);

    if (!purchase) {
      throw new Error("Purchase not found.");
    }

    /* ------------------------------------------------------------------ */
    /* Return                                                             */
    /* ------------------------------------------------------------------ */

    const updatedPurchase = await PurchaseRepository.findById(id);

    if (!updatedPurchase) {
      throw new Error("Purchase updated but could not be retrieved.");
    }

    return updatedPurchase;
  }

  /* ---------------------------------------------------------------------- */
  /* DELETE                                                                */
  /* ---------------------------------------------------------------------- */

  async delete(id: string, _userId: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid purchase id.");
    }

    const purchase = await PurchaseRepository.delete(id);

    if (!purchase) {
      throw new Error("Purchase not found.");
    }

    return purchase;
  }

  /* ---------------------------------------------------------------------- */
  /* EXPORT                                                                */
  /* ---------------------------------------------------------------------- */

  async exportExcel() {
    return PurchaseRepository.findAllForExport();
  }
}

export default new PurchaseService();
