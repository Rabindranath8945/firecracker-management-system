"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import BusinessService from "../services/business.service";

export function useSwitchBusiness() {
  const router = useRouter();

  return useMutation({
    mutationFn: (id: string) => BusinessService.switchBusiness(id),

    onSuccess: () => {
      router.replace("/dashboard");
    },
  });
}
