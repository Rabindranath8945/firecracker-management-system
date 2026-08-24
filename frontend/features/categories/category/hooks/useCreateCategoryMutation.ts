import { useMutation, useQueryClient } from "@tanstack/react-query";

import CategoryService from "../services/category.service";

export function useCreateCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: CategoryService.create,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
  });
}
