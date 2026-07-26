export type OnboardingStep =
  | "welcome"
  | "business"
  | "progress"
  | "business-info"
  | "tour";

export interface BusinessInfo {
  businessName: string;

  ownerName: string;

  mobile: string;

  gstNo: string;

  address: string;
}
