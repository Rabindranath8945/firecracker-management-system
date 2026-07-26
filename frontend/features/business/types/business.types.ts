export type BusinessType =
  | "GENERAL_STORE"
  | "MEDICAL"
  | "GROCERY"
  | "HARDWARE"
  | "STATIONERY"
  | "ELECTRONICS"
  | "CLOTHING"
  | "RESTAURANT"
  | "OTHER";

export type BusinessStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

export interface Business {
  id: string;

  businessId: string;

  name: string;

  type: BusinessType;

  owner: string;

  logo: string;

  phone?: string;

  email?: string;

  address?: string;

  status: BusinessStatus;

  isActive: boolean;

  createdBy?: string;

  updatedBy?: string;

  createdAt: string;

  updatedAt: string;
}

export interface CreateBusinessRequest {
  name: string;

  type: BusinessType;

  logo?: string;

  phone?: string;

  email?: string;

  address?: string;
}

export interface UpdateBusinessRequest {
  name?: string;

  type?: BusinessType;

  logo?: string;

  phone?: string;

  email?: string;

  address?: string;

  status?: BusinessStatus;

  isActive?: boolean;
}
