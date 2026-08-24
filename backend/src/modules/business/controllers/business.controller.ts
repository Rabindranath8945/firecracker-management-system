import { Request, Response } from "express";

import BusinessService from "../services/business.service.js";

import { toDto, toDtoArray } from "../../../common/mappers/mongoose.mapper.js";

type UpdateParams = {
  id: string;
};

class BusinessController {
  /* -------------------------------------------------------------------------- */
  /*                             Create Business                                */
  /* -------------------------------------------------------------------------- */

  create = async (req: Request, res: Response) => {
    const ownerId = req.user?.userId;

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const business = await BusinessService.create(req.body, ownerId);

    return res.status(201).json({
      success: true,
      message: "Business created successfully.",
      data: toDto(business),
    });
  };

  /* -------------------------------------------------------------------------- */
  /*                            Get My Business                                 */
  /* -------------------------------------------------------------------------- */

  getMine = async (req: Request, res: Response) => {
    const ownerId = req.user!.userId;

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const businesses = await BusinessService.getMyBusinesses(ownerId);

    return res.json({
      success: true,
      data: toDtoArray(businesses),
    });
  };

  /* -------------------------------------------------------------------------- */
  /*                           Get Current Business                             */
  /* -------------------------------------------------------------------------- */

  getCurrent = async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const business = await BusinessService.getCurrentBusiness(userId);

    if (!business) {
      return res.json({
        success: true,
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      data: toDto(business),
    });
  };

  /* -------------------------------------------------------------------------- */
  /*                            Search Business                                 */
  /* -------------------------------------------------------------------------- */

  search = async (req: Request, res: Response) => {
    const query = req.query.query;

    if (typeof query !== "string" || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Search query is required.",
      });
    }

    const business = await BusinessService.search(query.trim());

    if (!business) {
      return res.status(404).json({
        success: false,
        message: "Business not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: toDto(business),
    });
  };

  /* -------------------------------------------------------------------------- */
  /*                             Update Business                                */
  /* -------------------------------------------------------------------------- */

  update = async (req: Request, res: Response) => {
    const updatedBy = req.user?.userId;

    if (!updatedBy) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const id = req.params.id as string;

    const business = await BusinessService.update(id, req.body, updatedBy);

    return res.status(200).json({
      success: true,
      message: "Business updated successfully.",
      data: toDto(business),
    });
  };

  switchBusiness = async (req: Request, res: Response) => {
    const ownerId = req.user?.userId;

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const business = await BusinessService.switchBusiness(
      ownerId,
      req.params.id as string,
    );
    return res.json({
      success: true,
      data: toDto(business),
    });
  };
}

export default new BusinessController();
