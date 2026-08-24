import api from "@/lib/api";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export interface BusinessProfile {
  businessName: string;
  ownerName: string;

  gstNo: string;
  panNo: string;

  mobile: string;
  email: string;

  address: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;

  logo: string;
}

interface BackendBusiness {
  name: string;
  ownerName: string;

  logo?: string;
  businessType?: string;

  gstNo?: string;
  panNo?: string;

  phone: string;
  email?: string;

  website?: string;

  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

interface SettingsResponse {
  success: boolean;

  data: {
    business: BackendBusiness;
  };

  message?: string;
}

interface BusinessUpdateResponse {
  success: boolean;

  data: {
    business: BackendBusiness;
  };

  message?: string;
}

interface LogoResponse {
  success: boolean;

  data: {
    business: BackendBusiness;
  };

  message?: string;
}

/* -------------------------------------------------------------------------- */
/* Mapper                                                                     */
/* -------------------------------------------------------------------------- */

function mapBusinessToProfile(business: BackendBusiness): BusinessProfile {
  return {
    businessName: business.name ?? "",
    ownerName: business.ownerName ?? "",

    gstNo: business.gstNo ?? "",
    panNo: business.panNo ?? "",

    mobile: business.phone ?? "",
    email: business.email ?? "",

    address: business.address ?? "",
    city: business.city ?? "",
    state: business.state ?? "",
    pinCode: business.pincode ?? "",

    country: "India",

    logo: business.logo ?? "",
  };
}

/* -------------------------------------------------------------------------- */
/* Service                                                                    */
/* -------------------------------------------------------------------------- */

class BusinessProfileService {
  /* ------------------------------------------------------------------------ */
  /* GET                                                                      */
  /* ------------------------------------------------------------------------ */

  async getProfile(): Promise<BusinessProfile> {
    const response = await api.get<SettingsResponse>("/settings");

    if (!response.data.success) {
      throw new Error(
        response.data.message || "Failed to load business profile.",
      );
    }

    return mapBusinessToProfile(response.data.data.business);
  }

  /* ------------------------------------------------------------------------ */
  /* UPDATE BUSINESS                                                          */
  /* ------------------------------------------------------------------------ */

  async updateProfile(profile: BusinessProfile): Promise<BusinessProfile> {
    const response = await api.patch<BusinessUpdateResponse>(
      "/settings/business",
      {
        name: profile.businessName.trim(),

        ownerName: profile.ownerName.trim(),

        gstNo: profile.gstNo.trim().toUpperCase(),

        panNo: profile.panNo.trim().toUpperCase(),

        phone: profile.mobile.trim(),

        email: profile.email.trim(),

        address: profile.address.trim(),

        city: profile.city.trim(),

        state: profile.state.trim(),

        pincode: profile.pinCode.trim(),
      },
    );

    if (!response.data.success) {
      throw new Error(
        response.data.message || "Failed to update business profile.",
      );
    }

    return mapBusinessToProfile(response.data.data.business);
  }

  /* ------------------------------------------------------------------------ */
  /* LOGO                                                                     */
  /* ------------------------------------------------------------------------ */

  async uploadLogo(file: File): Promise<BusinessProfile> {
    const formData = new FormData();

    formData.append("logo", file);

    const response = await api.patch<LogoResponse>("/settings/logo", formData);

    if (!response.data.success) {
      throw new Error(
        response.data.message || "Failed to upload business logo.",
      );
    }

    return mapBusinessToProfile(response.data.data.business);
  }
}

export const businessProfileService = new BusinessProfileService();
