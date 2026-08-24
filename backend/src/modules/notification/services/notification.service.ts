import NotificationRepository from "../repositories/notification.repository.js";

import type {
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

  async latest(userId: string, limit = 20) {
    return NotificationRepository.latestForUser(userId, limit);
  }

  async latestForUser(userId: string, limit = 20) {
    return NotificationRepository.latestForUser(userId, limit);
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
    return NotificationRepository.bulkCreate(
      data.map((item) => ({
        ...item,
      })),
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Update                                   */
  /* -------------------------------------------------------------------------- */

  async update(id: string, userId: string, input: UpdateNotificationInput) {
    const notification = await NotificationRepository.findByIdForUser(
      id,
      userId,
    );

    this.ensureExists(notification);

    return this.ensureExists(
      await NotificationRepository.update(id, userId, {
        ...input,
        updatedBy: userId as never,
      }),
    );
  }

  async markRead(id: string, userId: string) {
    return this.ensureExists(await NotificationRepository.markRead(id, userId));
  }

  async markAllRead(userId: string) {
    return NotificationRepository.markAllRead(userId);
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Delete                                   */
  /* -------------------------------------------------------------------------- */

  async delete(id: string, userId: string) {
    return this.ensureExists(await NotificationRepository.delete(id, userId));
  }

  async clear(userId: string) {
    return NotificationRepository.clear(userId);
  }
}

export default new NotificationService();
