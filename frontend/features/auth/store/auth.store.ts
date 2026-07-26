import { create } from "zustand";

import type { AuthState, User } from "../types/auth.types";

interface AuthStore extends AuthState {
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  setRefreshToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  initialize: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,

  accessToken:
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null,

  refreshToken:
    typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null,

  isAuthenticated:
    typeof window !== "undefined"
      ? Boolean(localStorage.getItem("accessToken"))
      : false,

  isLoading: false,

  /* -------------------------------------------------------------------------- */
  /*                                 Set User                                   */
  /* -------------------------------------------------------------------------- */

  setUser: (user) =>
    set({
      user,
      isAuthenticated: user !== null,
    }),

  /* -------------------------------------------------------------------------- */
  /*                            Set Access Token                                */
  /* -------------------------------------------------------------------------- */

  setAccessToken: (accessToken) => {
    if (typeof window !== "undefined") {
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
      } else {
        localStorage.removeItem("accessToken");
      }
    }

    set({
      accessToken,
    });
  },

  /* -------------------------------------------------------------------------- */
  /*                           Set Refresh Token                                */
  /* -------------------------------------------------------------------------- */

  setRefreshToken: (refreshToken) => {
    if (typeof window !== "undefined") {
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      } else {
        localStorage.removeItem("refreshToken");
      }
    }

    set({
      refreshToken,
    });
  },

  /* -------------------------------------------------------------------------- */
  /*                               Set Loading                                  */
  /* -------------------------------------------------------------------------- */

  setLoading: (isLoading) =>
    set({
      isLoading,
    }),

  /* -------------------------------------------------------------------------- */
  /*                               Initialize                                   */
  /* -------------------------------------------------------------------------- */

  initialize: () =>
    set({
      accessToken:
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null,

      refreshToken:
        typeof window !== "undefined"
          ? localStorage.getItem("refreshToken")
          : null,

      isAuthenticated:
        typeof window !== "undefined"
          ? Boolean(localStorage.getItem("accessToken"))
          : false,
    }),

  /* -------------------------------------------------------------------------- */
  /*                                  Logout                                    */
  /* -------------------------------------------------------------------------- */

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }

    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },
}));
