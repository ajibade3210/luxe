"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Lightweight Toast notification management hook with auto-dismiss timer.
 */
export function useToast(autoDismissMs = 3500) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
  }, []);

  const hideToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;

    const timer = setTimeout(() => {
      setToastMessage(null);
    }, autoDismissMs);

    return () => clearTimeout(timer);
  }, [toastMessage, autoDismissMs]);

  return {
    toastMessage,
    showToast,
    hideToast,
  };
}
