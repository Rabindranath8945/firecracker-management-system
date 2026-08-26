"use client";

import { useState } from "react";
import { Capacitor } from "@capacitor/core";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";

import { env } from "@/libs/env/env";
import { useAuth } from "../hooks/useAuth";

interface GoogleSignInButtonProps {
  flow: "create" | "join";
}

export function GoogleSignInButton({ flow }: GoogleSignInButtonProps) {
  const { loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleNativeGoogleLogin = async () => {
    if (loading) return;

    try {
      setLoading(true);

      const { SocialLogin } = await import("@capgo/capacitor-social-login");

      await SocialLogin.initialize({
        google: {
          webClientId: env.googleClientId,
          mode: "online",
        },
      });

      const response = await SocialLogin.login({
        provider: "google",
        options: {
          scopes: ["email", "profile"],
          filterByAuthorizedAccounts: false,
        },
      });

      if (response.result.responseType !== "online") {
        throw new Error("Google login did not return an online response.");
      }

      const idToken = response.result.idToken;

      if (!idToken) {
        throw new Error("Google did not return an ID token.");
      }

      sessionStorage.setItem("auth-flow", flow);

      await loginWithGoogle(idToken);
    } catch (error) {
      console.error("Native Google login failed:", error);

      toast.error("Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /*
   * Android / Capacitor
   */
  if (Capacitor.isNativePlatform()) {
    return (
      <div className="w-full">
        <button
          type="button"
          onClick={handleNativeGoogleLogin}
          disabled={loading}
          className="
            flex
            h-14
            w-full
            items-center
            justify-center
            gap-3
            rounded-full
            border
            border-slate-200
            bg-white
            px-6
            text-base
            font-semibold
            text-slate-800
            shadow-sm
            transition
            hover:bg-slate-50
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          <span
            className="
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-full
              text-lg
              font-bold
            "
          >
            G
          </span>

          <span>
            {loading ? "Connecting to Google..." : "Continue with Google"}
          </span>
        </button>
      </div>
    );
  }

  /*
   * Normal browser
   */
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
          if (!credentialResponse.credential) {
            toast.error("Google sign-in did not return a credential.");
            return;
          }

          try {
            sessionStorage.setItem("auth-flow", flow);

            await loginWithGoogle(credentialResponse.credential);
          } catch (error) {
            console.error("Google login failed:", error);

            toast.error("Google sign-in failed. Please try again.");
          }
        }}
        onError={() => {
          console.error("Google login failed");

          toast.error("Google sign-in failed. Please try again.");
        }}
      />
    </div>
  );
}
