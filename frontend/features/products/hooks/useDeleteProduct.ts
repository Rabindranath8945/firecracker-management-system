import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import ProductService from "../services/product.service";

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ProductService.deleteProduct(id),

    onSuccess: () => {
      toast.success("Product deleted successfully.");

      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },

    onError: () => {
      toast.error("Unable to delete product.");
    },
  });
}
