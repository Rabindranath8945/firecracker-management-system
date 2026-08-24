import { Types } from "mongoose";

import BusinessRepository from "../../business/repositories/business.repository.js";
import UserService from "../../user/services/user.service.js";

import {
  createBusinessSchema,
  updateBusinessSchema,
} from "../../business/validators/business.validator.js";

import { generateBusinessId } from "../../business/utils/business-id.js";

class BusinessService {
  /* ------------------------------------------------------------------------ */
  /* CREATE                                                                   */
  /* ------------------------------------------------------------------------ */

  async create(data: unknown, ownerId: string) {
    if (!Types.ObjectId.isValid(ownerId)) {
      throw new Error("Invalid owner.");
    }

    const validated = createBusinessSchema.parse(data);

    let businessId = generateBusinessId();

    while (await BusinessRepository.findByBusinessId(businessId)) {
      businessId = generateBusinessId();
    }

    const business = await BusinessRepository.create({
      ...validated,

      businessId,

      owner: new Types.ObjectId(ownerId),

      createdBy: new Types.ObjectId(ownerId),
    });

    await UserService.setCurrentBusiness(ownerId, business._id.toString());

    return business;
  }

  /* ------------------------------------------------------------------------ */
  /* GET MY BUSINESS                                                          */
  /* ------------------------------------------------------------------------ */

  async getMyBusiness(ownerId: string) {
    if (!Types.ObjectId.isValid(ownerId)) {
      throw new Error("Invalid owner.");
    }

    const businesses = await BusinessRepository.findByOwner(ownerId);

    const business = businesses[0];

    if (!business) {
      throw new Error("Business not found.");
    }

    return business;
  }

  /* ------------------------------------------------------------------------ */
  /* FIND BY BUSINESS ID                                                      */
  /* ------------------------------------------------------------------------ */

  async findByBusinessId(businessId: string) {
    const business = await BusinessRepository.findByBusinessId(businessId);

    if (!business) {
      throw new Error("Business not found.");
    }

    return business;
  }

  /* ------------------------------------------------------------------------ */
  /* SEARCH                                                                   */
  /* ------------------------------------------------------------------------ */

  async search(query: string) {
    return BusinessRepository.search(query);
  }

  /* ------------------------------------------------------------------------ */
  /* UPDATE                                                                   */
  /* ------------------------------------------------------------------------ */

  async update(id: string, data: unknown, updatedBy: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid business.");
    }

    if (!Types.ObjectId.isValid(updatedBy)) {
      throw new Error("Invalid updater.");
    }

    const validated = updateBusinessSchema.parse(data);

    const business = await BusinessRepository.update(id, {
      ...validated,

      updatedBy: new Types.ObjectId(updatedBy),
    });

    if (!business) {
      throw new Error("Business not found.");
    }

    return business;
  }

  /* ------------------------------------------------------------------------ */
  /* DELETE                                                                   */
  /* ------------------------------------------------------------------------ */

  async delete(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid business.");
    }

    const business = await BusinessRepository.delete(id);

    if (!business) {
      throw new Error("Business not found.");
    }

    return business;
  }
}

export default new BusinessService();
