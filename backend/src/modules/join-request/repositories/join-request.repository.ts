import JoinRequest from "../models/join-request.model.js";

import { IJoinRequest } from "../interfaces/join-request.interface.js";

class JoinRequestRepository {
  /* -------------------------------------------------------------------------- */
  /*                                  Create                                    */
  /* -------------------------------------------------------------------------- */

  create(data: Partial<IJoinRequest>) {
    return JoinRequest.create(data);
  }

  /* -------------------------------------------------------------------------- */
  /*                                 Find One                                   */
  /* -------------------------------------------------------------------------- */

  findById(id: string) {
    return JoinRequest.findById(id).exec();
  }

  findPending(userId: string, businessId: string) {
    return JoinRequest.findOne({
      user: userId,
      business: businessId,
      status: "PENDING",
    }).exec();
  }

  /* -------------------------------------------------------------------------- */
  /*                                 Find Many                                  */
  /* -------------------------------------------------------------------------- */

  findByBusiness(businessId: string) {
    return JoinRequest.find({
      business: businessId,
      status: "PENDING",
    })
      .populate("user")
      .sort({ createdAt: -1 })
      .exec();
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Update                                    */
  /* -------------------------------------------------------------------------- */

  update(id: string, data: Partial<IJoinRequest>) {
    return JoinRequest.findByIdAndUpdate(id, data, {
      new: true,
    }).exec();
  }
}

export default new JoinRequestRepository();
