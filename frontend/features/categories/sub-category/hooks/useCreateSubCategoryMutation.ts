import { useMutation, useQueryClient } from "@tanstack/react-query";

import SubCategoryService from "../services/sub-category.service";

export function useCreateSubCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: SubCategoryService.create,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sub-categories"],
      });
    },
  });
}
