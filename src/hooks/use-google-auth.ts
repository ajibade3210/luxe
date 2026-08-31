"use client";

import { useCallback, useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initCodeClient(config: {
            client_id: string;
            scope: string;
            ux_mode?: "popup" | "redirect";
            callback: (response: {
              code?: string;
              error?: string;
              error_description?: string;
            }) => void;
            error_callback?: (error: { type: string; message?: string }) => void;
          }): {
            requestCode(): void;
          };
        };
        id?: {
          initialize(config: unknown): void;
          prompt(listener?: unknown): void;
        };
      };
    };
  }
}

const GSI_SCRIPT_ID = "gsi-client-script";
const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

/**
 * Loads Google Identity Services and provides a `trigger()` function that
 * opens the Google OAuth2 popup code authorization flow.
 *
 * This flow avoids FedCM One Tap suppression by opening an explicit,
 * user-initiated popup and passes the authorization code to the backend.
 */
export function useGoogleAuth(
  onAuthSuccess: (codeOrToken: string) => void,
  onError?: (message: string) => void
) {
  const [loaded, setLoaded] = useState(false);

  const onAuthSuccessRef = useRef(onAuthSuccess);
  const onErrorRef = useRef(onError);
  onAuthSuccessRef.current = onAuthSuccess;
  onErrorRef.current = onError;

  // 1. Load the GSI script once
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.google?.accounts?.oauth2) {
      setLoaded(true);
      return;
    }

    const existing = document.getElementById(GSI_SCRIPT_ID) as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener("load", () => setLoaded(true));
      return;
    }

    const script = document.createElement("script");
    script.id = GSI_SCRIPT_ID;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => setLoaded(true);
    script.onerror = () =>
      onErrorRef.current?.("Failed to load Google Sign-In. Check your network connection.");
    document.head.appendChild(script);
  }, []);

  // 2. Trigger the Google OAuth popup on user interaction
  const trigger = useCallback(() => {
    if (!CLIENT_ID) {
      onErrorRef.current?.(
        "Google Sign-In is not configured. Missing NEXT_PUBLIC_GOOGLE_CLIENT_ID."
      );
      return;
    }

    if (!window.google?.accounts?.oauth2) {
      onErrorRef.current?.("Google Sign-In is still loading. Please try again.");
      return;
    }

    try {
      const client = window.google.accounts.oauth2.initCodeClient({
        client_id: CLIENT_ID,
        scope: "openid email profile",
        ux_mode: "popup",
        callback: response => {
          if (response.code) {
            onAuthSuccessRef.current(response.code);
          } else if (response.error) {
            onErrorRef.current?.(
              response.error_description || response.error || "Google sign-in was cancelled."
            );
          }
        },
        error_callback: err => {
          onErrorRef.current?.(
            err.message || "Google popup encountered an error. Please try again."
          );
        },
      });

      client.requestCode();
    } catch (err) {
      onErrorRef.current?.(
        err instanceof Error ? err.message : "Failed to open Google sign-in window."
      );
    }
  }, []);

  return { trigger, loaded };
}
