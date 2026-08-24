"use client";

import { useCallback, useEffect, useState } from "react";

import profileService from "../services/profile.service";

import type { Profile, UpdateProfileInput } from "../types/profile.types";

export interface UseProfileResult {
  profile: Profile | null;
  loading: boolean;
  updating: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  updateProfile: (data: UpdateProfileInput) => Promise<Profile>;
}

export function useProfile(): UseProfileResult {
  const [profile, setProfile] = useState<Profile | null>(null);

  const [loading, setLoading] = useState(true);

  const [updating, setUpdating] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await profileService.getProfile();

      setProfile(data);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to load profile.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(
    async (data: UpdateProfileInput): Promise<Profile> => {
      try {
        setUpdating(true);
        setError(null);

        const updated = await profileService.updateProfile(data);

        setProfile(updated);

        return updated;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unable to update profile.";

        setError(message);

        throw err;
      } finally {
        setUpdating(false);
      }
    },
    [],
  );

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  return {
    profile,
    loading,
    updating,
    error,
    refresh: loadProfile,
    updateProfile,
  };
}

export default useProfile;
