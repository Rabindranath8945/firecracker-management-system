"use client";

import { useRouter } from "next/navigation";

import businessService from "../services/business.service";

import type {
  CreateBusinessRequest,
  UpdateBusinessRequest,
} from "../types/business.types";

export function useBusiness() {
  const router = useRouter();

  const createBusiness = async (payload: CreateBusinessRequest) => {
    try {
      await businessService.create(payload);

      router.replace("/onboarding/security");
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const searchBusiness = async (businessId: string) => {
    return businessService.search(businessId);
  };

  const updateBusiness = async (id: string, payload: UpdateBusinessRequest) => {
    return businessService.update(id, payload);
  };

  const getMyBusiness = async () => {
    return businessService.getMine();
  };

  return {
    createBusiness,
    searchBusiness,
    updateBusiness,
    getMyBusiness,
  };
}
