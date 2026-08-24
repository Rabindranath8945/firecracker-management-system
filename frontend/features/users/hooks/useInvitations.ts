"use client";

import { useCallback, useEffect, useState } from "react";

import InvitationService from "../services/invitation.service";

import type {
  CreateInvitationInput,
  CreateInvitationResponse,
  Invitation,
  ScanInvitationInput,
  ScanInvitationResponse,
} from "../types/invitation.types";

interface UseInvitationsReturn {
  invitations: Invitation[];

  pendingInvitations: Invitation[];

  loading: boolean;

  creating: boolean;

  error: string | null;

  refresh: () => Promise<void>;

  createInvitation: (
    input: CreateInvitationInput,
  ) => Promise<CreateInvitationResponse>;

  scanInvitation: (
    input: ScanInvitationInput,
  ) => Promise<ScanInvitationResponse>;

  requestJoin: (invitationId: string) => Promise<Invitation>;

  approveInvitation: (invitationId: string) => Promise<void>;

  rejectInvitation: (invitationId: string) => Promise<void>;

  revokeInvitation: (invitationId: string) => Promise<void>;

  deleteInvitation: (invitationId: string) => Promise<void>;
}

export function useInvitations(): UseInvitationsReturn {
  const [invitations, setInvitations] = useState<Invitation[]>([]);

  const [pendingInvitations, setPendingInvitations] = useState<Invitation[]>(
    [],
  );

  const [loading, setLoading] = useState(true);

  const [creating, setCreating] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [latest, pending] = await Promise.all([
        InvitationService.getLatest(),
        InvitationService.getPending(),
      ]);

      setInvitations(latest);
      setPendingInvitations(pending);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to load invitations.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const createInvitation = useCallback(
    async (input: CreateInvitationInput) => {
      try {
        setCreating(true);
        setError(null);

        const result = await InvitationService.create(input);

        await refresh();

        return result;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to create invitation.";

        setError(message);

        throw err;
      } finally {
        setCreating(false);
      }
    },
    [refresh],
  );

  const scanInvitation = useCallback(async (input: ScanInvitationInput) => {
    return InvitationService.scan(input);
  }, []);

  const requestJoin = useCallback(
    async (invitationId: string) => {
      const result = await InvitationService.requestJoin(invitationId);

      await refresh();

      return result;
    },
    [refresh],
  );

  const approveInvitation = useCallback(
    async (invitationId: string) => {
      await InvitationService.approve(invitationId);

      await refresh();
    },
    [refresh],
  );

  const rejectInvitation = useCallback(
    async (invitationId: string) => {
      await InvitationService.reject(invitationId);

      await refresh();
    },
    [refresh],
  );

  const revokeInvitation = useCallback(
    async (invitationId: string) => {
      await InvitationService.revoke(invitationId);

      await refresh();
    },
    [refresh],
  );

  const deleteInvitation = useCallback(
    async (invitationId: string) => {
      await InvitationService.delete(invitationId);

      await refresh();
    },
    [refresh],
  );

  return {
    invitations,

    pendingInvitations,

    loading,

    creating,

    error,

    refresh,

    createInvitation,

    scanInvitation,

    requestJoin,

    approveInvitation,

    rejectInvitation,

    revokeInvitation,

    deleteInvitation,
  };
}
