import type { Request, Response } from "express";

import UserService from "../services/user.service.js";

import type { IUser } from "../models/user.model.js";

class UserController {
  /* -------------------------------------------------------------------------- */
  /*                              Current User                                  */
  /* -------------------------------------------------------------------------- */

  async me(req: Request, res: Response) {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const user = await UserService.getCurrentUser(userId);

    return res.status(200).json({
      success: true,
      data: user,
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                              Employee Create                               */
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
      isOwner: false,
    });

    return res.status(201).json({
      success: true,
      message: "Employee created successfully.",
      data: employee,
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                              Get Employees                                 */
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

    return res.status(200).json({
      success: true,
      data: employees,
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                           Get Employee By ID                               */
  /* -------------------------------------------------------------------------- */

  async getEmployeeById(req: Request, res: Response) {
    const ownerId = req.user?.userId;
    const employeeId = String(req.params.id);

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const employee = await UserService.getEmployeeById(employeeId);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }

    /*
     * Prevent an owner/manager from accessing an unrelated
     * employee belonging to another business owner.
     */
    if (employee.owner?.toString() !== ownerId) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this employee.",
      });
    }

    return res.status(200).json({
      success: true,
      data: employee,
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                              Update Employee                               */
  /* -------------------------------------------------------------------------- */

  async updateEmployee(req: Request, res: Response) {
    const ownerId = req.user?.userId;
    const employeeId = String(req.params.id);

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const employee = await UserService.getEmployeeById(employeeId);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }

    if (employee.owner?.toString() !== ownerId) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this employee.",
      });
    }

    /*
     * Never allow employee ownership or owner role to be
     * changed through this endpoint.
     */
    const { owner, isOwner, googleId, createdBy, ...updateData } = req.body;

    void owner;
    void isOwner;
    void googleId;
    void createdBy;

    const updatedEmployee = await UserService.updateEmployee(
      employeeId,
      updateData,
    );

    if (!updatedEmployee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Employee updated successfully.",
      data: updatedEmployee,
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                           Toggle Employee Status                           */
  /* -------------------------------------------------------------------------- */

  async toggleEmployeeStatus(req: Request, res: Response) {
    const ownerId = req.user?.userId;
    const employeeId = String(req.params.id);

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const employee = await UserService.getEmployeeById(employeeId);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }

    if (employee.owner?.toString() !== ownerId) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this employee.",
      });
    }

    const updatedEmployee = await UserService.toggleEmployeeStatus(employeeId);

    if (!updatedEmployee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Employee status updated successfully.",
      data: updatedEmployee,
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                              Delete Employee                               */
  /* -------------------------------------------------------------------------- */

  async deleteEmployee(req: Request, res: Response) {
    const ownerId = req.user?.userId;
    const employeeId = String(req.params.id);

    if (!ownerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const employee = await UserService.getEmployeeById(employeeId);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }

    if (employee.owner?.toString() !== ownerId) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this employee.",
      });
    }

    const deletedEmployee = await UserService.deleteEmployee(employeeId);

    if (!deletedEmployee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Employee deactivated successfully.",
      data: deletedEmployee,
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                           Assign Business                                  */
  /* -------------------------------------------------------------------------- */

  async setCurrentBusiness(req: Request, res: Response) {
    const userId = req.user?.userId;
    const { businessId } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    if (!businessId) {
      return res.status(400).json({
        success: false,
        message: "Business ID is required.",
      });
    }

    const user = await UserService.setCurrentBusiness(
      userId,
      String(businessId),
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Business selected successfully.",
      data: user,
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                           Complete Onboarding                              */
  /* -------------------------------------------------------------------------- */

  async completeOnboarding(req: Request, res: Response) {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const user = await UserService.completeOnboarding(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Onboarding completed successfully.",
      data: user,
    });
  }

  async updateMe(req: Request, res: Response) {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const user = await UserService.updateMe(userId, req.body);

    return res.json({
      success: true,
      message: "Profile updated successfully.",
      data: user,
    });
  }

  /* -------------------------------------------------------------------------- */
  /*                                App Lock                                    */
  /* -------------------------------------------------------------------------- */

  async updateAppLock(req: Request, res: Response) {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized.",
      });
    }

    const { enabled } = req.body;

    if (typeof enabled !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "enabled must be a boolean.",
      });
    }

    const user = await UserService.updateAppLock(userId, enabled);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: enabled ? "App lock enabled." : "App lock disabled.",
      data: user,
    });
  }
}

export default new UserController();
