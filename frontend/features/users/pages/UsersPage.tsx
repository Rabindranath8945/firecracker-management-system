"use client";

import { useMemo, useState } from "react";

import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Filter,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";

import PageContainer from "@/features/shared/ui/layout/PageContainer";

import UserStats from "../components/UserStats";
import UserList from "../components/UserList";
import UserForm from "../components/UserForm";

import InviteUserDialog from "../components/InviteUserDialog";
import InvitationList from "../components/InvitationList";
import QRInvitationDialog from "../components/QRInvitationDialog";
import JoinRequestDialog from "../components/JoinRequestDialog";

import { useUsers } from "../hooks/useUsers";
import { useInvitations } from "../hooks/useInvitations";

import type { User } from "../types/user.types";
import type { Invitation } from "../types/invitation.types";
import type { CreateInvitationInput } from "../types/invitation.types";

export default function UsersPage() {
  /* ------------------------------------------------------------------------ */
  /* Users                                                                    */
  /* ------------------------------------------------------------------------ */

  const {
    users,
    stats,
    loading,
    error,
    toggleStatus,
    createUser,
    updateUser,
    refresh: refreshUsers,
  } = useUsers();

  /* ------------------------------------------------------------------------ */
  /* Invitations                                                              */
  /* ------------------------------------------------------------------------ */

  const {
    invitations,
    loading: invitationsLoading,
    creating: invitationCreating,
    error: invitationError,
    refresh: refreshInvitations,
    createInvitation,
    approveInvitation,
    rejectInvitation,
  } = useInvitations();

  /* ------------------------------------------------------------------------ */
  /* State                                                                    */
  /* ------------------------------------------------------------------------ */

  const [search, setSearch] = useState("");

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [formOpen, setFormOpen] = useState(false);

  const [inviteOpen, setInviteOpen] = useState(false);

  const [selectedInvitation, setSelectedInvitation] =
    useState<Invitation | null>(null);

  const [invitationToken, setInvitationToken] = useState("");

  const [qrOpen, setQrOpen] = useState(false);

  const [joinRequestOpen, setJoinRequestOpen] = useState(false);

  const [actionLoading, setActionLoading] = useState(false);

  const [pageError, setPageError] = useState<string | null>(null);

  /* ------------------------------------------------------------------------ */
  /* Business                                                                 */
  /* ------------------------------------------------------------------------ */

  /* ------------------------------------------------------------------------ */
  /* Filtering                                                                */
  /* ------------------------------------------------------------------------ */

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return users;
    }

    return users.filter((user) => {
      const name = `${user.firstName} ${user.lastName}`.toLowerCase();

      return (
        name.includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
      );
    });
  }, [users, search]);

  /* ------------------------------------------------------------------------ */
  /* Pending invitations                                                      */
  /* ------------------------------------------------------------------------ */

  const pendingRequests = invitations.filter(
    (invitation) =>
      invitation.status === "PENDING" && Boolean(invitation.requestedBy),
  );

  const pendingInvites = invitations.filter(
    (invitation) => invitation.status === "PENDING" && !invitation.requestedBy,
  );

  /* ------------------------------------------------------------------------ */
  /* Refresh                                                                  */
  /* ------------------------------------------------------------------------ */

  async function refreshAll() {
    try {
      setPageError(null);

      await Promise.all([refreshUsers(), refreshInvitations()]);
    } catch (error) {
      setPageError(
        error instanceof Error
          ? error.message
          : "Failed to refresh user management.",
      );
    }
  }

  /* ------------------------------------------------------------------------ */
  /* Create invitation                                                        */
  /* ------------------------------------------------------------------------ */

  async function handleCreateInvitation(input: CreateInvitationInput) {
    const result = await createInvitation(input);

    setInvitationToken(result.token);

    setInviteOpen(false);

    setQrOpen(true);

    await refreshInvitations();

    return result;
  }

  /* ------------------------------------------------------------------------ */
  /* QR                                                                       */
  /* ------------------------------------------------------------------------ */

  function handleViewQR(invitation: Invitation) {
    if (!invitationToken) {
      setPageError(
        "This invitation QR is no longer available. Create a new invitation to generate a QR code.",
      );

      return;
    }

    setSelectedInvitation(invitation);

    setQrOpen(true);
  }

  /* ------------------------------------------------------------------------ */
  /* Join request                                                             */
  /* ------------------------------------------------------------------------ */

  function handleOpenJoinRequest(invitation: Invitation) {
    if (!invitation.requestedBy) {
      return;
    }

    setSelectedInvitation(invitation);

    setJoinRequestOpen(true);
  }

  /* ------------------------------------------------------------------------ */
  /* Approve                                                                  */
  /* ------------------------------------------------------------------------ */

  async function handleApprove() {
    if (!selectedInvitation) {
      return;
    }

    try {
      setActionLoading(true);
      setPageError(null);

      await approveInvitation(selectedInvitation.id);

      setJoinRequestOpen(false);

      setSelectedInvitation(null);

      await refreshAll();
    } catch (error) {
      setPageError(
        error instanceof Error
          ? error.message
          : "Failed to approve join request.",
      );
    } finally {
      setActionLoading(false);
    }
  }

  /* ------------------------------------------------------------------------ */
  /* Reject                                                                   */
  /* ------------------------------------------------------------------------ */

  async function handleReject() {
    if (!selectedInvitation) {
      return;
    }

    try {
      setActionLoading(true);
      setPageError(null);

      await rejectInvitation(selectedInvitation.id);

      setJoinRequestOpen(false);

      setSelectedInvitation(null);

      await refreshInvitations();
    } catch (error) {
      setPageError(
        error instanceof Error
          ? error.message
          : "Failed to reject join request.",
      );
    } finally {
      setActionLoading(false);
    }
  }

  /* ------------------------------------------------------------------------ */
  /* Loading                                                                  */
  /* ------------------------------------------------------------------------ */

  if (loading) {
    return (
      <PageContainer>
        <div className="flex min-h-[55vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 shadow-sm">
              <Users className="h-6 w-6 animate-pulse text-sky-600" />
            </div>

            <p className="mt-4 text-xs font-medium text-slate-500">
              Loading user management...
            </p>
          </div>
        </div>
      </PageContainer>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Main                                                                     */
  /* ------------------------------------------------------------------------ */

  return (
    <PageContainer className="space-y-5 pb-32">
      {/* ================================================================== */}
      {/* PAGE TITLE                                                         */}
      {/* ================================================================== */}

      <div className="flex items-center justify-between px-1 pt-10">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-sky-600">
            Administration
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 dark:text-white">
            Users
          </h1>

          <p className="mt-1 text-xs text-slate-500">
            Manage your team and access.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void refreshAll()}
          disabled={loading || invitationsLoading}
          className="
            flex h-10 w-10 items-center justify-center
            rounded-2xl border border-slate-200
            bg-white text-slate-500 shadow-sm
            transition-all duration-200
            hover:border-sky-200 hover:text-sky-600
            active:scale-95
            disabled:opacity-50
            dark:border-slate-800
            dark:bg-slate-950
          "
          aria-label="Refresh"
        >
          <RefreshCw
            className={
              loading || invitationsLoading ? "h-4 w-4 animate-spin" : "h-4 w-4"
            }
          />
        </button>
      </div>

      {/* ================================================================== */}
      {/* STATISTICS                                                         */}
      {/* ================================================================== */}

      <div className="overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <UserStats stats={stats} />
      </div>

      {/* ================================================================== */}
      {/* PENDING REQUEST BANNER                                             */}
      {/* ================================================================== */}

      {pendingRequests.length > 0 && (
        <button
          type="button"
          onClick={() => {
            const invitation = pendingRequests[0];

            if (!invitation) {
              return;
            }

            handleOpenJoinRequest(invitation);
          }}
          className="
      group
      flex
      w-full
      items-center
      gap-3
      rounded-2xl
      border
      border-amber-200
      bg-gradient-to-r
      from-amber-50
      to-orange-50
      p-4
      text-left
      shadow-sm
      transition-all
      duration-300
      hover:-translate-y-0.5
      hover:shadow-md
      dark:border-amber-900/40
      dark:from-amber-950/30
      dark:to-orange-950/20
    "
        >
          <div
            className="
        flex
        h-11
        w-11
        shrink-0
        items-center
        justify-center
        rounded-2xl
        bg-white
        shadow-sm
        dark:bg-slate-900
      "
          >
            <Clock3 className="h-5 w-5 text-amber-500" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {pendingRequests.length} join request
              {pendingRequests.length !== 1 ? "s" : ""} waiting
            </p>

            <p className="mt-0.5 text-[11px] text-slate-500">
              Review employee access requests.
            </p>
          </div>

          <ArrowRight
            className="
        h-4
        w-4
        text-slate-400
        transition-transform
        group-hover:translate-x-1
      "
          />
        </button>
      )}

      {/* ================================================================== */}
      {/* ERROR                                                              */}
      {/* ================================================================== */}

      {(pageError || invitationError) && (
        <div
          className="
            flex items-start gap-3
            rounded-2xl border border-red-200
            bg-red-50 p-4
            dark:border-red-900/40
            dark:bg-red-950/20
          "
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />

          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-red-700 dark:text-red-400">
              Unable to complete request
            </p>

            <p className="mt-1 text-[11px] leading-5 text-red-600 dark:text-red-400">
              {pageError ?? invitationError}
            </p>
          </div>

          <button
            type="button"
            onClick={() => void refreshAll()}
            className="text-[11px] font-bold text-red-600"
          >
            Retry
          </button>
        </div>
      )}

      {/* ================================================================== */}
      {/* SEARCH / ACTION BAR                                                */}
      {/* ================================================================== */}

      <section
        className="
          overflow-hidden rounded-[1.75rem]
          border border-slate-200/80
          bg-white shadow-sm
          dark:border-slate-800
          dark:bg-slate-950
        "
      >
        <div className="p-4">
          <div className="relative">
            <Search
              className="
                pointer-events-none absolute left-4
                top-1/2 h-4 w-4 -translate-y-1/2
                text-slate-400
              "
            />

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search name, email or role..."
              className="
                h-12 w-full rounded-2xl
                border border-slate-200
                bg-slate-50 pl-11 pr-4
                text-xs text-slate-900
                outline-none transition
                placeholder:text-slate-400
                focus:border-sky-300
                focus:bg-white
                focus:ring-4
                focus:ring-sky-500/5
                dark:border-slate-800
                dark:bg-slate-900
                dark:text-white
              "
            />
          </div>

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              className="
                flex h-11 w-11 shrink-0
                items-center justify-center
                rounded-2xl border
                border-slate-200 bg-white
                text-slate-500
                transition hover:border-sky-200
                hover:text-sky-600
                dark:border-slate-800
                dark:bg-slate-950
              "
              aria-label="Filter users"
            >
              <Filter className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={() => setInviteOpen(true)}
              className="
                flex h-11 flex-1
                items-center justify-center gap-2
                rounded-2xl bg-slate-950
                px-5 text-xs font-bold text-white
                shadow-lg shadow-slate-950/10
                transition-all duration-200
                hover:-translate-y-0.5
                hover:shadow-xl
                active:scale-[0.98]
                dark:bg-white
                dark:text-slate-950
              "
            >
              <UserPlus className="h-4 w-4" />
              Add User
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-slate-100 px-4 py-3 dark:border-slate-900">
          <ShieldCheck className="h-3.5 w-3.5 text-sky-500" />

          <p className="text-[10px] text-slate-500">
            Users join securely through owner-approved invitations.
          </p>
        </div>
      </section>

      {/* ================================================================== */}
      {/* TEAM                                                               */}
      {/* ================================================================== */}

      <section className="space-y-3">
        <div className="flex items-end justify-between px-1">
          <div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-sky-500" />

              <h2 className="text-base font-bold text-slate-950 dark:text-white">
                Team Members
              </h2>
            </div>

            <p className="mt-1 text-[11px] text-slate-500">
              {filteredUsers.length}{" "}
              {filteredUsers.length === 1 ? "member" : "members"} connected to
              your business.
            </p>
          </div>
        </div>

        <UserList
          users={filteredUsers}
          onEdit={(user) => {
            setSelectedUser(user);
            setFormOpen(true);
          }}
          onToggleStatus={(user) => void toggleStatus(user.id)}
        />
      </section>

      {/* ================================================================== */}
      {/* INVITATIONS                                                         */}
      {/* ================================================================== */}

      <section className="space-y-3">
        <div className="flex items-end justify-between px-1">
          <div>
            <div className="flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-violet-500" />

              <h2 className="text-base font-bold text-slate-950 dark:text-white">
                Invitations
              </h2>
            </div>

            <p className="mt-1 text-[11px] text-slate-500">
              Invite employees and manage access.
            </p>
          </div>

          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600 dark:bg-slate-900 dark:text-slate-400">
            {invitations.length}
          </span>
        </div>

        {pendingInvites.length > 0 && (
          <div className="flex items-center gap-2 rounded-xl bg-violet-50 px-3 py-2.5 dark:bg-violet-950/20">
            <CheckCircle2 className="h-4 w-4 text-violet-500" />

            <p className="text-[10px] font-medium text-violet-700 dark:text-violet-400">
              {pendingInvites.length} invitation
              {pendingInvites.length !== 1 ? "s" : ""} awaiting employee
              response.
            </p>
          </div>
        )}

        <InvitationList
          invitations={invitations}
          loading={invitationsLoading}
          onViewQR={handleViewQR}
          onApprove={handleOpenJoinRequest}
          onReject={handleOpenJoinRequest}
        />
      </section>

      {/* ================================================================== */}
      {/* INVITE DIALOG                                                       */}
      {/* ================================================================== */}

      <InviteUserDialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        loading={invitationCreating}
        onCreate={handleCreateInvitation}
      />

      {/* ================================================================== */}
      {/* QR DIALOG                                                           */}
      {/* ================================================================== */}

      {selectedInvitation && invitationToken ? (
        <QRInvitationDialog
          open={qrOpen}
          invitation={selectedInvitation}
          token={invitationToken}
          onClose={() => setQrOpen(false)}
        />
      ) : null}

      {/* ================================================================== */}
      {/* JOIN REQUEST                                                        */}
      {/* ================================================================== */}

      <JoinRequestDialog
        open={joinRequestOpen}
        invitation={selectedInvitation}
        loading={actionLoading}
        onApprove={() => void handleApprove()}
        onReject={() => void handleReject()}
        onClose={() => {
          if (!actionLoading) {
            setJoinRequestOpen(false);
          }
        }}
      />

      {/* ================================================================== */}
      {/* EDIT USER                                                           */}
      {/* ================================================================== */}

      <UserForm
        open={formOpen}
        user={selectedUser}
        onClose={() => {
          setFormOpen(false);
          setSelectedUser(null);
        }}
        onCreate={async (data) => {
          await createUser(data);
          await refreshUsers();
        }}
        onUpdate={async (id, data) => {
          await updateUser(id, data);
          await refreshUsers();
        }}
      />
    </PageContainer>
  );
}
