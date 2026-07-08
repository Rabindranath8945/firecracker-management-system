import { ISession, Session } from "../models/session.model.js";

class SessionRepository {
  async create(session: Partial<ISession>): Promise<ISession> {
    return await Session.create(session);
  }

  async findByRefreshToken(refreshToken: string): Promise<ISession | null> {
    return await Session.findOne({
      refreshToken,
      isActive: true,
    });
  }

  async findByUserId(userId: string): Promise<ISession | null> {
    return await Session.findOne({
      userId,
      isActive: true,
    });
  }

  async findByDeviceId(deviceId: string): Promise<ISession | null> {
    return await Session.findOne({
      deviceId,
      isActive: true,
    });
  }

  async deleteByUserId(userId: string): Promise<void> {
    await Session.deleteMany({ userId });
  }

  async deleteByDeviceId(deviceId: string): Promise<void> {
    await Session.deleteMany({ deviceId });
  }

  async revoke(refreshToken: string): Promise<void> {
    await Session.findOneAndUpdate({ refreshToken }, { isActive: false });
  }
}

export const sessionRepository = new SessionRepository();
