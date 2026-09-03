import { apiClient } from "@/lib/api-client";
import type {
  Bank,
  BillingSummary,
  BusinessBilling,
  InitializePaymentParams,
  InitializePaymentResponse,
  ResolveAccountParams,
  ResolvedAccount,
  UpdatePayoutAccountParams,
} from "@/types";

// ---------------------------------------------------------------------------
// VENDOR BILLING & SETTLEMENT
// ---------------------------------------------------------------------------

export async function getPaystackBanks(): Promise<Bank[]> {
  const data = await apiClient.get<Bank[] | { items: Bank[] }>("/billing/banks");
  if (Array.isArray(data)) return data;
  if (
    data &&
    typeof data === "object" &&
    "items" in data &&
    Array.isArray((data as { items: Bank[] }).items)
  ) {
    return (data as { items: Bank[] }).items;
  }
  return [];
}

export async function resolvePayoutAccount(params: ResolveAccountParams): Promise<ResolvedAccount> {
  return apiClient.post<ResolvedAccount>("/billing/resolve-account", params);
}

export async function updatePayoutAccount(
  params: UpdatePayoutAccountParams
): Promise<BusinessBilling> {
  return apiClient.post<BusinessBilling>("/billing/payout-account", params);
}

export async function getBillingSummary(): Promise<BillingSummary> {
  return apiClient.get<BillingSummary>("/billing/summary");
}

// ---------------------------------------------------------------------------
// STOREFRONT SPLIT PAYMENT INITIALIZATION
// ---------------------------------------------------------------------------

export async function initializeOrderPayment(
  params: InitializePaymentParams
): Promise<InitializePaymentResponse> {
  return apiClient.post<InitializePaymentResponse>(
    "/billing/storefront/initialize-payment",
    params
  );
}
