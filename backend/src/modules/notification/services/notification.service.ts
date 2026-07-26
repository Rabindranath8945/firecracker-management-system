import NotificationRepository from "../repositories/notification.repository.js";

import {
  CreateNotificationInput,
  UpdateNotificationInput,
} from "../validators/notification.validator.js";

class NotificationService {
  private ensureExists<T>(notification: T | null): T {
    if (!notification) {
      throw new Error("Notification not found.");
    }

    return notification;
  }

  /* -------------------------------------------------------------------------- */
  /*                                    Find                                    */
  /* -------------------------------------------------------------------------- */

  async get() {
    return NotificationRepository.find();
  }

  async getById(id: string) {
    return this.ensureExists(await NotificationRepository.findById(id));
  }

  async latest(limit = 20) {
    return NotificationRepository.latest(limit);
  }

  async unread(userId: string) {
    return NotificationRepository.findUnread(userId);
  }

  async unreadCount(userId: string) {
    return NotificationRepository.unreadCount(userId);
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Create                                   */
  /* -------------------------------------------------------------------------- */

  async create(userId: string, input: CreateNotificationInput) {
    return NotificationRepository.create({
      ...input,
      createdBy: userId as never,
    });
  }

  async createMany(data: CreateNotificationInput[]) {
    return NotificationRepository.bulkCreate(data);
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Update                                   */
  /* -------------------------------------------------------------------------- */

  async update(id: string, userId: string, input: UpdateNotificationInput) {
    const notification = await this.getById(id);

    return NotificationRepository.update(notification.id, {
      ...input,
      updatedBy: userId as never,
    });
  }

  async markRead(id: string) {
    await this.getById(id);

    return NotificationRepository.markRead(id);
  }

  async markAllRead(userId: string) {
    return NotificationRepository.markAllRead(userId);
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Delete                                   */
  /* -------------------------------------------------------------------------- */

  async delete(id: string) {
    await this.getById(id);

    return NotificationRepository.delete(id);
  }

  async clear(userId: string) {
    return NotificationRepository.clear(userId);
  }
}

export default new NotificationService();
