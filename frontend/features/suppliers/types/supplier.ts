import type { PartyFormValues } from "@/features/shared/master-data/party/lib/party-schema";

export interface Supplier extends PartyFormValues {
  id: string;

  supplierNo: string;

  balance: number;

  createdAt: string;

  updatedAt: string;
}
