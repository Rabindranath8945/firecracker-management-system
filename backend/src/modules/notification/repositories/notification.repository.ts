import Notification from "../models/notification.model.js";
import { INotification } from "../interfaces/notification.interface.js";

class NotificationRepository {
  /* -------------------------------------------------------------------------- */
  /*                                   Create                                   */
  /* -------------------------------------------------------------------------- */

  async create(data: Partial<INotification>) {
    return Notification.create(data);
  }

  async bulkCreate(data: Partial<INotification>[]) {
    return Notification.insertMany(data);
  }

  /* -------------------------------------------------------------------------- */
  /*                                    Find                                    */
  /* -------------------------------------------------------------------------- */

  async find() {
    return Notification.find().sort({
      createdAt: -1,
    });
  }

  async findById(id: string) {
    return Notification.findById(id);
  }

  async unreadCount(userId: string) {
    return Notification.countDocuments({
      createdBy: userId,
      read: false,
    });
  }

  async findUnread(userId: string) {
    return Notification.find({
      createdBy: userId,
      read: false,
    }).sort({
      createdAt: -1,
    });
  }

  async findUnreadLowStock(userId: string, productId: string) {
    return Notification.findOne({
      createdBy: userId,
      type: "LOW_STOCK",
      read: false,
      "data.productId": productId,
    });
  }

  async latest(limit = 20) {
    return Notification.find()
      .sort({
        createdAt: -1,
      })
      .limit(limit);
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Update                                   */
  /* -------------------------------------------------------------------------- */

  async update(id: string, data: Partial<INotification>) {
    return Notification.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async markRead(id: string) {
    return Notification.findByIdAndUpdate(
      id,
      {
        read: true,
      },
      {
        new: true,
      },
    );
  }

  async markAllRead(userId: string) {
    return Notification.updateMany(
      {
        createdBy: userId,
        read: false,
      },
      {
        read: true,
      },
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Delete                                   */
  /* -------------------------------------------------------------------------- */

  async delete(id: string) {
    return Notification.findByIdAndDelete(id);
  }

  async clear(userId: string) {
    return Notification.deleteMany({
      createdBy: userId,
    });
  }
}

export default new NotificationRepository();
