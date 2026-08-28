"use client";

import { useCallback, useEffect, useState } from "react";
import { CUSTOM_EVENTS } from "@/constants";
import { calculateBusinessValuation } from "@/lib/api";
import type { BusinessValuation } from "@/types";

export function useValuation(notify?: (message: string) => void) {
  const [valuation, setValuation] = useState<BusinessValuation | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchValuation = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await calculateBusinessValuation();
      setValuation(res);
    } catch {
      // Keep existing or fallback
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchValuation();

    const handleUpdate = () => {
      fetchValuation();
    };

    window.addEventListener(CUSTOM_EVENTS.expensesUpdated, handleUpdate);
    window.addEventListener(CUSTOM_EVENTS.customersUpdated, handleUpdate);
    window.addEventListener(CUSTOM_EVENTS.invoicesUpdated, handleUpdate);

    return () => {
      window.removeEventListener(CUSTOM_EVENTS.expensesUpdated, handleUpdate);
      window.removeEventListener(CUSTOM_EVENTS.customersUpdated, handleUpdate);
      window.removeEventListener(CUSTOM_EVENTS.invoicesUpdated, handleUpdate);
    };
  }, [fetchValuation]);

  const refreshValuation = async () => {
    await fetchValuation();
    notify?.("Business valuation estimate recalculated with latest metrics.");
  };

  return {
    valuation,
    isLoading,
    refreshValuation,
  };
}
