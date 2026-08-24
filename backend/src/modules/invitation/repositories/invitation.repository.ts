import Invitation from "../models/invitation.model.js";

import type { IInvitation } from "../interfaces/invitation.interface.js";

class InvitationRepository {
  async create(data: Partial<IInvitation>): Promise<IInvitation> {
    return Invitation.create(data);
  }

  async findById(id: string): Promise<IInvitation | null> {
    return Invitation.findById(id).exec();
  }

  async findByTokenHash(tokenHash: string): Promise<IInvitation | null> {
    return Invitation.findOne({
      tokenHash,
    }).exec();
  }

  async findByOwner(ownerId: string): Promise<IInvitation[]> {
    return Invitation.find({
      ownerId,
    })
      .sort({
        createdAt: -1,
      })
      .exec();
  }

  async findPendingByOwner(ownerId: string): Promise<IInvitation[]> {
    return Invitation.find({
      ownerId,
      status: "PENDING",
    })
      .sort({
        createdAt: -1,
      })
      .exec();
  }

  async findPendingByBusiness(businessId: string): Promise<IInvitation[]> {
    return Invitation.find({
      businessId,
      status: "PENDING",
    })
      .sort({
        createdAt: -1,
      })
      .exec();
  }

  async update(
    id: string,
    data: Partial<IInvitation>,
  ): Promise<IInvitation | null> {
    return Invitation.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).exec();
  }

  async incrementUsage(id: string): Promise<IInvitation | null> {
    return Invitation.findByIdAndUpdate(
      id,
      {
        $inc: {
          usedCount: 1,
        },
      },
      {
        new: true,
      },
    ).exec();
  }

  async delete(id: string): Promise<IInvitation | null> {
    return Invitation.findByIdAndDelete(id).exec();
  }
}

export const invitationRepository = new InvitationRepository();
