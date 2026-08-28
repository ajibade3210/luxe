"use client";

import { useCallback, useEffect, useState } from "react";
import {
  connectGoogleBusiness,
  disconnectGoogleBusiness,
  getGoogleConnection,
  getGoogleReviews,
  selectGoogleLocation,
  syncGoogleReviews,
} from "@/services/api/reviews.service";
import type { GoogleBusinessConnection, GoogleReview } from "@/types";

export function useGoogleReviews(onToast?: (msg: string) => void) {
  const [connection, setConnection] = useState<GoogleBusinessConnection | null>(null);
  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  const notify = useCallback(
    (msg: string) => {
      if (onToast) onToast(msg);
    },
    [onToast]
  );

  // Load initial connection and cached reviews
  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const [conn, revs] = await Promise.all([getGoogleConnection(), getGoogleReviews()]);
        if (isMounted) {
          setConnection(conn);
          setReviews(revs);
          setIsLoading(false);
        }
      } catch {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    load();

    // Check for callback query params from real OAuth redirect
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const authStatus = params.get("google_auth");
      if (authStatus === "success") {
        notify("Google Business Profile connected successfully!");
        params.delete("google_auth");
        params.delete("error_reason");
        const cleanQuery = params.toString();
        const cleanUrl = `${window.location.pathname}${cleanQuery ? `?${cleanQuery}` : ""}`;
        window.history.replaceState({}, "", cleanUrl);
      } else if (authStatus === "error") {
        const reason = params.get("error_reason") || "Authorization failed";
        notify(`Google connection error: ${reason}`);
        params.delete("google_auth");
        params.delete("error_reason");
        const cleanQuery = params.toString();
        const cleanUrl = `${window.location.pathname}${cleanQuery ? `?${cleanQuery}` : ""}`;
        window.history.replaceState({}, "", cleanUrl);
      }
    }

    return () => {
      isMounted = false;
    };
  }, [notify]);

  const handleConnect = useCallback(
    async (locationId?: string) => {
      setIsConnecting(true);
      // If in browser, initiate real Google OAuth redirect
      if (typeof window !== "undefined") {
        const returnUrl = encodeURIComponent(window.location.pathname);
        window.location.href = `/api/auth/google?returnUrl=${returnUrl}`;
        return;
      }
      try {
        const conn = await connectGoogleBusiness(locationId);
        setConnection(conn);
        const revs = await getGoogleReviews();
        setReviews(revs);
        notify("Google Business Profile connected successfully");
      } catch {
        notify("Failed to connect Google Business Profile");
      } finally {
        setIsConnecting(false);
      }
    },
    [notify]
  );

  const handleDisconnect = useCallback(async () => {
    try {
      const conn = await disconnectGoogleBusiness();
      setConnection(conn);
      notify("Google Business Profile disconnected");
    } catch {
      notify("Failed to disconnect Google Business Profile");
    }
  }, [notify]);

  const handleSelectLocation = useCallback(
    async (locationId: string) => {
      try {
        const conn = await selectGoogleLocation(locationId);
        setConnection(conn);
        notify(`Switched to location: ${conn.selectedLocation?.locationName}`);
      } catch {
        notify("Failed to switch location");
      }
    },
    [notify]
  );

  const handleSync = useCallback(async () => {
    setIsSyncing(true);
    notify("Syncing Google reviews...");
    try {
      const result = await syncGoogleReviews(connection?.selectedLocation?.locationId);
      setConnection(result.connection);
      setReviews(result.reviews);
      notify(`Google reviews synced (${result.reviews.length} reviews)`);
    } catch {
      notify("Failed to sync Google reviews");
    } finally {
      setIsSyncing(false);
    }
  }, [connection, notify]);

  const handleCopyReviewLink = useCallback(async () => {
    if (!connection?.directReviewUrl) return;
    try {
      await navigator.clipboard.writeText(connection.directReviewUrl);
      notify("1-Click Review link copied to clipboard");
    } catch {
      notify("Unable to copy link to clipboard");
    }
  }, [connection, notify]);

  return {
    connection,
    reviews,
    isLoading,
    isSyncing,
    isConnecting,
    handleConnect,
    handleDisconnect,
    handleSelectLocation,
    handleSync,
    handleCopyReviewLink,
  };
}
