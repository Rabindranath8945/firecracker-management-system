import { Request, Response } from "express";

import JoinRequestService from "../services/join-request.service.js";
import UserService from "../../user/services/user.service.js";

class JoinRequestController {
  create = async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const request = await JoinRequestService.create(userId, req.body);

    return res.status(201).json({
      success: true,
      data: request,
    });
  };

  approve = async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const request = await JoinRequestService.approve(id);

    return res.json({
      success: true,
      message: "Employee approved.",
      data: request,
    });
  };

  reject = async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const request = await JoinRequestService.reject(id);

    return res.json({
      success: true,
      message: "Employee rejected.",
      data: request,
    });
  };

  pending = async (req: Request, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await UserService.getUserById(userId);

    if (!user?.business) {
      return res.status(400).json({
        success: false,
        message: "Business not found.",
      });
    }

    const requests = await JoinRequestService.getPending(
      user.business.toString(),
    );

    return res.json({
      success: true,
      data: requests,
    });
  };
}

export default new JoinRequestController();
