import { Types } from "mongoose";

import JoinRequestRepository from "../repositories/join-request.repository.js";
import BusinessRepository from "../../business/repositories/business.repository.js";

import { createJoinRequestSchema } from "../validators/join-request.validator.js";

import UserService from "../../user/services/user.service.js";
import type { UserRole } from "../../user/constants/user.constants.js";

class JoinRequestService {
  /* -------------------------------------------------------------------------- */
  /*                              Join Business                                 */
  /* -------------------------------------------------------------------------- */

  async create(userId: string, data: unknown) {
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user.");
    }

    const validated = createJoinRequestSchema.parse(data);

    const business = await BusinessRepository.findByBusinessId(
      validated.businessId,
    );

    if (!business) {
      throw new Error("Business not found.");
    }

    const existing = await JoinRequestRepository.findPending(
      userId,
      business._id.toString(),
    );

    if (existing) {
      throw new Error("Join request already pending.");
    }

    return JoinRequestRepository.create({
      business: business._id,

      user: new Types.ObjectId(userId),

      role: validated.role ?? "CASHIER",

      status: "PENDING",
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                          Pending Requests                                  */
  /* -------------------------------------------------------------------------- */

  async getPending(businessId: string) {
    return JoinRequestRepository.findByBusiness(businessId);
  }

  /* -------------------------------------------------------------------------- */
  /*                              Approve                                       */
  /* -------------------------------------------------------------------------- */

  async approve(id: string) {
    const request = await JoinRequestRepository.findById(id);

    if (!request) {
      throw new Error("Join request not found.");
    }

    await UserService.activateEmployee(
      request.user.toString(),
      request.business.toString(),
      request.role as UserRole,
    );

    return JoinRequestRepository.update(id, {
      status: "APPROVED",
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                               Reject                                       */
  /* -------------------------------------------------------------------------- */

  async reject(id: string) {
    const request = await JoinRequestRepository.update(id, {
      status: "REJECTED",
    });

    if (!request) {
      throw new Error("Join request not found.");
    }

    return request;
  }
}

export default new JoinRequestService();
