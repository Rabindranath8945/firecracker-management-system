import Notification from "../models/notification.model.js";

import type { INotification } from "../interfaces/notification.interface.js";

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
    return Notification.find().sort({ createdAt: -1 }).limit(100).lean().exec();
  }

  async findById(id: string) {
    return Notification.findById(id).lean().exec();
  }

  async findByIdForUser(id: string, userId: string) {
    return Notification.findOne({
      _id: id,
      createdBy: userId,
    })
      .lean()
      .exec();
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Latest                                   */
  /* -------------------------------------------------------------------------- */

  async latestForUser(userId: string, limit = 20) {
    return Notification.find({
      createdBy: userId,
    })
      .sort({ createdAt: -1 })
      .limit(Math.min(limit, 50))
      .lean()
      .exec();
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Unread                                   */
  /* -------------------------------------------------------------------------- */

  async unreadCount(userId: string) {
    return Notification.countDocuments({
      createdBy: userId,
      read: false,
    }).exec();
  }

  async findUnread(userId: string) {
    return Notification.find({
      createdBy: userId,
      read: false,
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean()
      .exec();
  }

  async findUnreadLowStock(userId: string, productId: string) {
    return Notification.findOne({
      createdBy: userId,
      type: "LOW_STOCK",
      read: false,
      "data.productId": productId,
    })
      .lean()
      .exec();
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Update                                   */
  /* -------------------------------------------------------------------------- */

  async update(id: string, userId: string, data: Partial<INotification>) {
    return Notification.findOneAndUpdate(
      {
        _id: id,
        createdBy: userId,
      },
      data,
      {
        new: true,
        runValidators: true,
      },
    )
      .lean()
      .exec();
  }

  async markRead(id: string, userId: string) {
    return Notification.findOneAndUpdate(
      {
        _id: id,
        createdBy: userId,
      },
      {
        $set: {
          read: true,
        },
      },
      {
        new: true,
      },
    )
      .lean()
      .exec();
  }

  async markAllRead(userId: string) {
    return Notification.updateMany(
      {
        createdBy: userId,
        read: false,
      },
      {
        $set: {
          read: true,
        },
      },
    ).exec();
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Delete                                   */
  /* -------------------------------------------------------------------------- */

  async delete(id: string, userId: string) {
    return Notification.findOneAndDelete({
      _id: id,
      createdBy: userId,
    })
      .lean()
      .exec();
  }

  async clear(userId: string) {
    return Notification.deleteMany({
      createdBy: userId,
    }).exec();
  }
}

export default new NotificationRepository();
