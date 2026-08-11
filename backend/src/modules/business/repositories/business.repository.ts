import Business from "../models/business.model.js";

import { IBusiness } from "../interfaces/business.interface.js";

class BusinessRepository {
  /* -------------------------------------------------------------------------- */
  /*                                  Create                                    */
  /* -------------------------------------------------------------------------- */

  create(data: Partial<IBusiness>) {
    return Business.create(data);
  }

  /* -------------------------------------------------------------------------- */
  /*                                 Find One                                   */
  /* -------------------------------------------------------------------------- */

  findById(id: string) {
    return Business.findById(id).lean().exec();
  }

  findByBusinessId(businessId: string) {
    return Business.findOne({ businessId }).lean().exec();
  }

  findByOwner(ownerId: string) {
    return Business.find({
      owner: ownerId,
      isActive: true,
    })
      .sort({ createdAt: 1 })
      .lean()
      .exec();
  }

  findByIdAndOwner(id: string, ownerId: string) {
    return Business.findOne({
      _id: id,
      owner: ownerId,
      isActive: true,
    })
      .lean()
      .exec();
  }

  search(query: string) {
    return Business.findOne({
      $or: [
        {
          businessId: {
            $regex: query,
            $options: "i",
          },
        },
        {
          name: {
            $regex: query,
            $options: "i",
          },
        },
      ],
    })
      .lean()
      .exec();
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Update                                   */
  /* -------------------------------------------------------------------------- */

  update(id: string, data: Partial<IBusiness>) {
    return Business.findByIdAndUpdate(id, data, {
      returnDocument: "after",
    })
      .lean()
      .exec();
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Delete                                   */
  /* -------------------------------------------------------------------------- */

  delete(id: string) {
    return Business.findByIdAndUpdate(
      id,
      {
        isActive: false,
        status: "INACTIVE",
      },
      {
        new: true,
      },
    ).exec();
  }
}

export default new BusinessRepository();
