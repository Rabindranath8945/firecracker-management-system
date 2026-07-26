export interface UserDto {
  businessId: string;

  businessQr?: string;

  allowJoinRequest: boolean;

  defaultRole: "OWNER" | "MANAGER" | "CASHIER" | "STAFF";

  maxDevices: number;
}
