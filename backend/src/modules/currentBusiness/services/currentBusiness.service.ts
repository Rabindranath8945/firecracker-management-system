import { Types } from "mongoose";

import BusinessRepository from "../repositories/business.repository.js";
import UserService from "../../user/services/user.service.js";

import {
  createBusinessSchema,
  updateBusinessSchema,
} from "../validators/currentBusiness.validator.js";

import { generateBusinessId } from "../utils/currentBusiness-id.js";

class BusinessService {
  /* -------------------------------------------------------------------------- */
  /*                                  Create                                    */
  /* -------------------------------------------------------------------------- */

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

    await UserService.assignBusiness(ownerId, business._id.toString());

    return business;
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Get Mine                                  */
  /* -------------------------------------------------------------------------- */

  async getMyBusiness(ownerId: string) {
    if (!Types.ObjectId.isValid(ownerId)) {
      throw new Error("Invalid owner.");
    }

    const business = await BusinessRepository.findByOwner(ownerId);

    if (!business) {
      throw new Error("Business not found.");
    }

    return business;
  }

  /* -------------------------------------------------------------------------- */
  /*                              Search Business                               */
  /* -------------------------------------------------------------------------- */

  async findByBusinessId(businessId: string) {
    const business = await BusinessRepository.findByBusinessId(businessId);

    if (!business) {
      throw new Error("Business not found.");
    }

    return business;
  }

  async search(query: string) {
    return BusinessRepository.search(query);
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Update                                    */
  /* -------------------------------------------------------------------------- */

  async update(id: string, data: unknown, updatedBy: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid business.");
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

  /* -------------------------------------------------------------------------- */
  /*                                  Delete                                    */
  /* -------------------------------------------------------------------------- */

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
