import api from "@/lib/api";

import {
  createOfflinePurchase,
  deleteOfflinePurchase,
  getOfflinePurchase,
  getOfflinePurchases,
  updateOfflinePurchase,
} from "@/libs/offline/store/offline.purchases";

import {
  addToSyncQueue,
  cancelPendingCreate,
  updatePendingCreatePayload,
} from "@/libs/offline/sync/sync.queue";

import { buildPurchasePayload } from "../api/purchases.api";

import type { CreatePurchaseRequest, Purchase } from "../types/purchase.types";

/* -------------------------------------------------------------------------- */
/* SERVICE                                                                    */
/* -------------------------------------------------------------------------- */

class PurchaseService {
  /* ------------------------------------------------------------------------ */
  /* GET PURCHASE                                                             */
  /* ------------------------------------------------------------------------ */

  async getPurchase(id: string): Promise<Purchase> {
    if (!id) {
      throw new Error("Purchase ID is required.");
    }

    if (typeof navigator !== "undefined" && !navigator.onLine) {
      const purchase = await getOfflinePurchase(id);

      if (!purchase) {
        throw new Error("Purchase not found offline.");
      }

      return purchase as unknown as Purchase;
    }

    const response = await api.get(`/purchases/${id}`);

    return response.data.data;
  }

  /* ------------------------------------------------------------------------ */
  /* GET ALL                                                                  */
  /* ------------------------------------------------------------------------ */

  async getPurchases(): Promise<Purchase[]> {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      const purchases = await getOfflinePurchases();

      return purchases as unknown as Purchase[];
    }

    const response = await api.get("/purchases");

    return response.data.data.items ?? [];
  }

  /* ------------------------------------------------------------------------ */
  /* CREATE                                                                   */
  /* ------------------------------------------------------------------------ */

  async createPurchase(data: CreatePurchaseRequest): Promise<Purchase> {
    const payload = buildPurchasePayload(data);

    /* ONLINE */
    if (typeof navigator === "undefined" || navigator.onLine) {
      const response = await api.post("/purchases", payload);

      return response.data.data;
    }

    /* OFFLINE */

    const offlineId = `offline-purchase-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 10)}`;

    const offlinePurchase = await createOfflinePurchase({
      id: offlineId,

      purchaseNo: `OFF-${Date.now()}`,

      supplierId: payload.supplier,

      purchaseDate: payload.purchaseDate,

      ...(payload.invoiceNo
        ? {
            invoiceNo: payload.invoiceNo,
          }
        : {}),

      ...(payload.dueDate
        ? {
            dueDate: payload.dueDate,
          }
        : {}),

      paymentMethod: payload.paymentMethod,

      transportCharge: payload.transportCharge,

      paidAmount: payload.paidAmount,

      dueAmount: payload.dueAmount,

      subtotal: payload.subtotal,

      discount: payload.discount,

      gstTotal: payload.taxAmount,

      grandTotal: payload.grandTotal,

      paymentStatus: payload.paymentStatus,

      ...(payload.notes
        ? {
            notes: payload.notes,
          }
        : {}),

      items: payload.items.map((item) => ({
        productId: item.product,

        quantity: item.quantity,

        purchasePrice: item.purchasePrice,

        sellingPrice: item.sellingPrice,

        discount: item.discount,

        gstRate: item.gstRate,

        subtotal: item.subtotal,

        gstAmount: item.tax,

        total: item.total,
      })),
    });

    await addToSyncQueue(
      "PURCHASE",
      "CREATE",
      JSON.stringify(payload),
      offlinePurchase.id,
    );

    return offlinePurchase as unknown as Purchase;
  }

  /* ------------------------------------------------------------------------ */
  /* UPDATE                                                                   */
  /* ------------------------------------------------------------------------ */

  async updatePurchase(
    id: string,
    data: CreatePurchaseRequest,
  ): Promise<Purchase> {
    if (!id) {
      throw new Error("Purchase ID is required.");
    }

    const payload = buildPurchasePayload(data);

    /* ONLINE */
    if (typeof navigator === "undefined" || navigator.onLine) {
      const response = await api.put(`/purchases/${id}`, payload);

      return response.data.data;
    }

    /* OFFLINE */

    const existing = await getOfflinePurchase(id);

    if (!existing) {
      throw new Error("Purchase not found offline.");
    }

    const updated = await updateOfflinePurchase(id, {
      id,

      purchaseNo: existing.purchaseNo,

      ...(existing.invoiceNo
        ? {
            invoiceNo: existing.invoiceNo,
          }
        : {}),

      supplierId: payload.supplier,

      purchaseDate: payload.purchaseDate,

      ...(payload.dueDate
        ? {
            dueDate: payload.dueDate,
          }
        : {}),

      paymentMethod: payload.paymentMethod,

      transportCharge: payload.transportCharge,

      paidAmount: payload.paidAmount,

      dueAmount: payload.dueAmount,

      subtotal: payload.subtotal,

      discount: payload.discount,

      gstTotal: payload.taxAmount,

      grandTotal: payload.grandTotal,

      paymentStatus: payload.paymentStatus,

      ...(payload.notes
        ? {
            notes: payload.notes,
          }
        : {}),

      items: payload.items.map((item) => ({
        productId: item.product,

        quantity: item.quantity,

        purchasePrice: item.purchasePrice,

        sellingPrice: item.sellingPrice,

        discount: item.discount,

        gstRate: item.gstRate,

        subtotal: item.subtotal,

        gstAmount: item.tax,

        total: item.total,
      })),
    });

    const createUpdated = await updatePendingCreatePayload(
      "PURCHASE",
      id,
      payload,
    );

    if (createUpdated) {
      return updated as unknown as Purchase;
    }

    await addToSyncQueue("PURCHASE", "UPDATE", JSON.stringify(payload), id);

    return updated as unknown as Purchase;

    if (id.startsWith("offline-purchase-")) {
      return updated as unknown as Purchase;
    }

    await addToSyncQueue("PURCHASE", "UPDATE", JSON.stringify(payload), id);

    return updated as unknown as Purchase;
  }

  /* ------------------------------------------------------------------------ */
  /* DELETE                                                                   */
  /* ------------------------------------------------------------------------ */

  async deletePurchase(id: string): Promise<void> {
    if (!id) {
      throw new Error("Purchase ID is required.");
    }

    /* ONLINE */
    if (typeof navigator === "undefined" || navigator.onLine) {
      await api.delete(`/purchases/${id}`);

      return;
    }

    /* OFFLINE */

    const existing = await getOfflinePurchase(id);

    if (!existing) {
      throw new Error("Purchase not found offline.");
    }

    await deleteOfflinePurchase(id);

    /*
     * If this purchase was created
     * offline and has not synced yet,
     * don't send DELETE to the server.
     *
     * The CREATE queue item will be
     * cancelled by the queue layer.
     */
    if (id.startsWith("offline-purchase-")) {
      return;
    }

    await addToSyncQueue(
      "PURCHASE",
      "DELETE",
      JSON.stringify({
        id,
      }),
      id,
    );
  }
}

export default new PurchaseService();
