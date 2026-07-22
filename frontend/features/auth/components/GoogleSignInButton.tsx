"use client";

import { GoogleLogin } from "@react-oauth/google";

import { useAuth } from "../hooks/useAuth";

export function GoogleSignInButton() {
  const { loginWithGoogle } = useAuth();

  return (
    <div className="flex justify-center">
      <GoogleLogin
        theme="outline"
        size="large"
        shape="pill"
        text="signin_with"
        width="320"
        useOneTap={false}
        onSuccess={async (credentialResponse) => {
          if (!credentialResponse.credential) return;

          await loginWithGoogle(credentialResponse.credential);
        }}
        onError={() => {
          console.error("Google login failed");
        }}
      />
    </div>
  );
}
