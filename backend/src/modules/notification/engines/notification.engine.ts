import NotificationService from "../services/notification.service.js";
import NotificationRepository from "../repositories/notification.repository.js";

class NotificationEngine {
  /* -------------------------------------------------------------------------- */
  /*                               Low Stock                                    */
  /* -------------------------------------------------------------------------- */

  async lowStock(data: {
    userId: string;
    productId: string;
    productName: string;
    currentStock: number;
    minimumStock: number;
  }) {
    const existing = await NotificationRepository.findUnreadLowStock(
      data.userId,
      data.productId,
    );

    if (existing) {
      return existing;
    }

    return NotificationService.create(data.userId, {
      title: "Low Stock Alert",

      message: `${data.productName} is below minimum stock. Current: ${data.currentStock}, Minimum: ${data.minimumStock}.`,

      type: "LOW_STOCK",

      data: {
        productId: data.productId,
        currentStock: data.currentStock,
        minimumStock: data.minimumStock,
      },
    });
  }
  /* -------------------------------------------------------------------------- */
  /*                             Purchase Created                               */
  /* -------------------------------------------------------------------------- */

  async purchaseCreated(data: {
    userId: string;
    purchaseId: string;
    purchaseNo: string;
    supplier: string;
    total: number;
  }) {
    return NotificationService.create(data.userId, {
      title: "Purchase Created",

      message: `Purchase ${data.purchaseNo} from ${data.supplier} created successfully.`,

      type: "PURCHASE",

      data: {
        purchaseId: data.purchaseId,
        total: data.total,
      },
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                               Sale Created                                 */
  /* -------------------------------------------------------------------------- */

  async saleCreated(data: {
    userId: string;
    saleId: string;
    invoiceNo: string;
    customer: string;
    total: number;
  }) {
    return NotificationService.create(data.userId, {
      title: "Sale Created",

      message: `Sale ${data.invoiceNo} completed successfully.`,

      type: "SALES",

      data: {
        saleId: data.saleId,
        customer: data.customer,
        total: data.total,
      },
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                             Backup Completed                               */
  /* -------------------------------------------------------------------------- */

  async backupCompleted(data: {
    userId: string;
    backupId: string;
    fileName: string;
  }) {
    return NotificationService.create(data.userId, {
      title: "Backup Completed",

      message: `${data.fileName} backup created successfully.`,

      type: "BACKUP",

      data: {
        backupId: data.backupId,
      },
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                              Security Alert                                */
  /* -------------------------------------------------------------------------- */

  async securityAlert(data: {
    userId: string;
    title: string;
    message: string;
  }) {
    return NotificationService.create(data.userId, {
      title: data.title,

      message: data.message,

      type: "SECURITY",
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                              System Notification                           */
  /* -------------------------------------------------------------------------- */

  async system(data: { userId: string; title: string; message: string }) {
    return NotificationService.create(data.userId, {
      title: data.title,

      message: data.message,

      type: "SYSTEM",
    });
  }
}

export default new NotificationEngine();
