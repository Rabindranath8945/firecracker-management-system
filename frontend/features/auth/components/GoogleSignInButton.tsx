"use client";

import { GoogleLogin } from "@react-oauth/google";

import { useAuth } from "../hooks/useAuth";

export function GoogleSignInButton() {
  const { loginWithGoogle } = useAuth();

  return (
    <GoogleLogin
      onSuccess={async (credentialResponse) => {
        if (!credentialResponse.credential) return;

        await loginWithGoogle(credentialResponse.credential);
      }}
      onError={() => {
        console.error("Google login failed");
      }}
      useOneTap={false}
    />
  );
}
