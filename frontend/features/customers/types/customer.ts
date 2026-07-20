import type { PartyFormValues } from "@/features/shared/master-data/party/lib/party-schema";

export interface Customer extends PartyFormValues {
  id: string;

  customerNo: string;

  balance: number;

  createdAt: string;

  updatedAt: string;
}
