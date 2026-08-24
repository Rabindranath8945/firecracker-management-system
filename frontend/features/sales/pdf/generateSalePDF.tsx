import { pdf } from "@react-pdf/renderer";

import SaleInvoicePDF from "./SaleInvoicePDF";

import type { Sale } from "../types/Sales.types";

export interface BusinessSettings {
  name?: string;
  ownerName?: string;
  logo?: string;
  businessType?: string;
  gstNo?: string;
  panNo?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface InvoiceSettings {
  prefix?: string;
  nextNumber?: number;
  footer?: string;
  terms?: string;
  showLogo?: boolean;
  showGST?: boolean;
  showCustomerMobile?: boolean;
  showCustomerAddress?: boolean;
}

export interface TaxSettings {
  enabled?: boolean;
  defaultGST?: number;
  taxType?: string;
  currency?: string;
  currencySymbol?: string;
}

export async function generateSalePDF(
  sale: Sale,
  business: BusinessSettings,
  invoice: InvoiceSettings,
  tax: TaxSettings,
): Promise<Blob> {
  return pdf(
    <SaleInvoicePDF
      sale={sale}
      business={business}
      invoice={invoice}
      tax={tax}
    />,
  ).toBlob();
}
