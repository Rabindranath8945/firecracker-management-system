import { useQuery } from "@tanstack/react-query";

import SalesService from "../services/sales.service";

import type { SalesQueryParams } from "../types/Sales.types";

export function useSales(params: SalesQueryParams = {}) {
  return useQuery({
    queryKey: ["sales", params],

    queryFn: () => SalesService.getSales(params),

    staleTime: 30_000,
  });
}
