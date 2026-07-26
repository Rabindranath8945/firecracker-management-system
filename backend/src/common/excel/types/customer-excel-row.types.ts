export interface CustomerExcelRow {
  customerCode: string;

  name: string;

  mobile: string;

  alternateMobile?: string;

  email?: string;

  gstNo?: string;

  address?: string;

  city?: string;

  state?: string;

  pinCode?: string;

  openingBalance: number;

  notes?: string;

  isActive: boolean;
}
