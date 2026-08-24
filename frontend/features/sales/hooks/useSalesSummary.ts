// hooks/useSalesSummary.ts

import { useQuery } from "@tanstack/react-query";

import SalesService from "../services/sales.service";

export function useSalesSummary() {
  return useQuery({
    queryKey: ["sales-summary"],
    queryFn: SalesService.getSummary,
  });
}
