import authService from "./auth.service";
import BusinessService from "@/features/business/services/business.service";

export type BootstrapResult =
  | {
      type: "ONBOARDING";
    }
  | {
      type: "SELECT_BUSINESS";
    }
  | {
      type: "DASHBOARD";
    };

class BootstrapService {
  async initialize(): Promise<BootstrapResult> {
    const user = await authService.me();

    const businesses = await BusinessService.getMine();

    console.log("Businesses:", businesses);

    if (businesses.length === 0) {
      return {
        type: "ONBOARDING",
      };
    }

    if (businesses.length === 1) {
      const firstBusiness = businesses[0];

      if (!firstBusiness) {
        return {
          type: "ONBOARDING",
        };
      }

      await BusinessService.switchBusiness(firstBusiness.id);

      return {
        type: "DASHBOARD",
      };
    }

    if (user.currentBusiness) {
      const current = businesses.find(
        (business) => business.id === user.currentBusiness,
      );

      if (current) {
        await BusinessService.switchBusiness(current.id);

        return {
          type: "DASHBOARD",
        };
      }
    }

    return {
      type: "SELECT_BUSINESS",
    };
  }
}

export default new BootstrapService();
