import { useQuery } from "@tanstack/react-query";
import { productApi } from "../api/product.api";

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await productApi.getAll();

      console.log("Products API Response:", response.data);

      return response.data;
    },
  });
}
