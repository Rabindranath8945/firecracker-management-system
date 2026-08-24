import { ISale } from "./sales.interface.js";

export interface ISaleInvoiceCustomer {
  _id: string;

  customerCode: string;

  name: string;

  mobile?: string;

  email?: string;

  address?: string;

  gstNo?: string;
}

export interface ISaleInvoice extends Omit<ISale, "customer"> {
  customer?: ISaleInvoiceCustomer;
}
