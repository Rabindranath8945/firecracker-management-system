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
    return Business.findById(id).exec();
  }

  findByBusinessId(businessId: string) {
    return Business.findOne({ businessId }).exec();
  }

  findByOwner(ownerId: string) {
    return Business.findOne({ owner: ownerId }).exec();
  }

  async search(query: string) {
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
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Update                                   */
  /* -------------------------------------------------------------------------- */

  update(id: string, data: Partial<IBusiness>) {
    return Business.findByIdAndUpdate(id, data, {
      new: true,
    }).exec();
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
