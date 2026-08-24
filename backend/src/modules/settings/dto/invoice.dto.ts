export interface InvoiceDto {
  prefix: string;

  nextNumber: number;

  footer?: string;

  terms?: string;

  showLogo: boolean;

  showGST: boolean;

  showCustomerMobile: boolean;

  showCustomerAddress: boolean;
}
