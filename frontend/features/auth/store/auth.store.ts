import { create } from "zustand";

import type { AuthState, User } from "../types/auth.types";

interface AuthStore extends AuthState {
  setUser: (user: User | null) => void;
  setAccessToken: (token: string | null) => void;
  setRefreshToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,

  accessToken: null,

  refreshToken: null,

  isAuthenticated: false,

  isLoading: true,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: user !== null,
    }),

  setAccessToken: (accessToken) =>
    set({
      accessToken,
    }),

  setRefreshToken: (refreshToken) =>
    set({
      refreshToken,
    }),

  setLoading: (isLoading) =>
    set({
      isLoading,
    }),

  logout: () =>
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
    }),
}));
