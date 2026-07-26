"use client";

import { GoogleLogin } from "@react-oauth/google";

import { useAuth } from "../hooks/useAuth";

interface GoogleSignInButtonProps {
  flow: "create" | "join";
}

export function GoogleSignInButton({ flow }: GoogleSignInButtonProps) {
  const { loginWithGoogle } = useAuth();

  return (
    <div className="flex justify-center">
      <GoogleLogin
        theme="outline"
        size="large"
        shape="pill"
        text="continue_with"
        width="320"
        useOneTap={false}
        onSuccess={async (credentialResponse) => {
          if (!credentialResponse.credential) return;

          // Save selected flow
          sessionStorage.setItem("auth-flow", flow);

          await loginWithGoogle(credentialResponse.credential);
        }}
        onError={() => {
          console.error("Google login failed");
        }}
      />
    </div>
  );
}
