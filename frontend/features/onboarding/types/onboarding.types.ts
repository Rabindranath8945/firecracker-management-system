export type OnboardingStep = "business" | "progress" | "business-info";

export interface BusinessInfo {
  businessName: string;

  ownerName: string;

  mobile: string;

  gstNo: string;

  address: string;
}
