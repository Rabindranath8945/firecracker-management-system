import api from "@/lib/api";

import type {
  CreateInvitationInput,
  CreateInvitationResponse,
  Invitation,
  ScanInvitationInput,
  ScanInvitationResponse,
} from "../types/invitation.types";

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

class InvitationService {
  /* -------------------------------------------------------------------------- */
  /*                              Create Invitation                             */
  /* -------------------------------------------------------------------------- */

  async create(
    input: CreateInvitationInput,
  ): Promise<CreateInvitationResponse> {
    const response = await api.post<ApiResponse<CreateInvitationResponse>>(
      "/invitations",
      input,
    );

    return response.data.data;
  }

  /* -------------------------------------------------------------------------- */
  /*                              Get Invitations                               */
  /* -------------------------------------------------------------------------- */

  async getLatest(): Promise<Invitation[]> {
    const response = await api.get<ApiResponse<Invitation[]>>("/invitations");

    return response.data.data;
  }

  /* -------------------------------------------------------------------------- */
  /*                           Get Pending Invitations                          */
  /* -------------------------------------------------------------------------- */

  async getPending(): Promise<Invitation[]> {
    const response = await api.get<ApiResponse<Invitation[]>>(
      "/invitations/pending",
    );

    return response.data.data;
  }

  /* -------------------------------------------------------------------------- */
  /*                              Get By ID                                     */
  /* -------------------------------------------------------------------------- */

  async getById(id: string): Promise<Invitation> {
    const response = await api.get<ApiResponse<Invitation>>(
      `/invitations/${id}`,
    );

    return response.data.data;
  }

  /* -------------------------------------------------------------------------- */
  /*                              Scan QR                                        */
  /* -------------------------------------------------------------------------- */

  async scan(input: ScanInvitationInput): Promise<ScanInvitationResponse> {
    const response = await api.post<ApiResponse<ScanInvitationResponse>>(
      "/invitations/scan",
      input,
    );

    return response.data.data;
  }

  /* -------------------------------------------------------------------------- */
  /*                              Request Join                                   */
  /* -------------------------------------------------------------------------- */

  async requestJoin(invitationId: string): Promise<Invitation> {
    const response = await api.post<ApiResponse<Invitation>>(
      `/invitations/${invitationId}/request-join`,
    );

    return response.data.data;
  }

  /* -------------------------------------------------------------------------- */
  /*                                Approve                                     */
  /* -------------------------------------------------------------------------- */

  async approve(invitationId: string): Promise<{
    invitation: Invitation;
    employee: unknown;
  }> {
    const response = await api.patch<
      ApiResponse<{
        invitation: Invitation;
        employee: unknown;
      }>
    >(`/invitations/${invitationId}/approve`);

    return response.data.data;
  }

  /* -------------------------------------------------------------------------- */
  /*                                 Reject                                     */
  /* -------------------------------------------------------------------------- */

  async reject(invitationId: string): Promise<Invitation> {
    const response = await api.patch<ApiResponse<Invitation>>(
      `/invitations/${invitationId}/reject`,
    );

    return response.data.data;
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Revoke                                    */
  /* -------------------------------------------------------------------------- */

  async revoke(invitationId: string): Promise<Invitation> {
    const response = await api.patch<ApiResponse<Invitation>>(
      `/invitations/${invitationId}/revoke`,
    );

    return response.data.data;
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Delete                                    */
  /* -------------------------------------------------------------------------- */

  async delete(invitationId: string): Promise<void> {
    await api.delete(`/invitations/${invitationId}`);
  }
}

export default new InvitationService();
