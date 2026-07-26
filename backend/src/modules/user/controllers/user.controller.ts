import { Request, Response } from "express";

import UserService from "../services/user.service.js";

class UserController {
  /* -------------------------------------------------------------------------- */
  /*                               Employee Create                              */
  /* -------------------------------------------------------------------------- */

  async createEmployee(req: Request, res: Response) {
    const ownerId = req.user?.userId;

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const employee = await UserService.createEmployee({
      ...req.body,
      owner: ownerId,
    });

    return res.status(201).json({
      success: true,
      message: "Employee created successfully.",
      data: employee,
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                              Get All Employees                             */
  /* -------------------------------------------------------------------------- */

  async getEmployees(req: Request, res: Response) {
    const ownerId = req.user?.userId;

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const employees = await UserService.getEmployees(ownerId);

    return res.json({
      success: true,
      data: employees,
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                              Get Employee By Id                            */
  /* -------------------------------------------------------------------------- */

  async getEmployeeById(req: Request, res: Response) {
    const employee = await UserService.getEmployeeById(String(req.params.id));

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }

    return res.json({
      success: true,
      data: employee,
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                              Update Employee                               */
  /* -------------------------------------------------------------------------- */

  async updateEmployee(req: Request, res: Response) {
    const employee = await UserService.updateEmployee(
      String(req.params.id),
      req.body,
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }

    return res.json({
      success: true,
      message: "Employee updated successfully.",
      data: employee,
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                           Toggle Employee Status                           */
  /* -------------------------------------------------------------------------- */

  async toggleEmployeeStatus(req: Request, res: Response) {
    const employee = await UserService.toggleEmployeeStatus(
      String(req.params.id),
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }

    return res.json({
      success: true,
      message: "Employee status updated successfully.",
      data: employee,
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                              Delete Employee                               */
  /* -------------------------------------------------------------------------- */

  async deleteEmployee(req: Request, res: Response) {
    const employee = await UserService.deleteEmployee(String(req.params.id));

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }

    return res.json({
      success: true,
      message: "Employee deleted successfully.",
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                              Current Logged User                           */
  /* -------------------------------------------------------------------------- */

  async me(req: Request, res: Response) {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const user = await UserService.getUserById(userId);

    return res.json({
      success: true,
      data: user,
    });
  }
}

export default new UserController();
