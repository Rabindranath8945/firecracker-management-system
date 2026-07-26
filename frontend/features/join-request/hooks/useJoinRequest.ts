"use client";

import { useRouter } from "next/navigation";

import joinRequestService from "../services/join-request.service";

import type { CreateJoinRequest } from "../types/join-request.types";

export function useJoinRequest() {
  const router = useRouter();

  const createRequest = async (payload: CreateJoinRequest) => {
    try {
      await joinRequestService.create(payload);

      router.replace("/join-business/request-sent");
    } catch (error) {
      console.error(error);

      throw error;
    }
  };

  const getPendingRequests = async () => {
    return joinRequestService.pending();
  };

  const approveRequest = async (id: string) => {
    return joinRequestService.approve(id);
  };

  const rejectRequest = async (id: string) => {
    return joinRequestService.reject(id);
  };

  return {
    createRequest,
    getPendingRequests,
    approveRequest,
    rejectRequest,
  };
}
