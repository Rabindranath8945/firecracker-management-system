export type JoinRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface JoinRequest {
  id: string;

  business: string;

  user: string;

  role: string;

  status: JoinRequestStatus;

  createdAt: string;

  updatedAt: string;
}

export interface CreateJoinRequest {
  businessId: string;

  role?: string;
}
