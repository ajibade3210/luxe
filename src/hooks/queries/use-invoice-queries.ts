"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import {
  deleteInvoice,
  getInvoiceById,
  getInvoices,
  getInvoicesByCustomerId,
  markInvoiceAsPaid,
  markInvoiceAsUnpaid,
  resendInvoice,
  saveInvoiceDraft,
  sendInvoice,
} from "@/services/api/invoice.service";
import type { Invoice, InvoiceInput, InvoiceStatus } from "@/types";

export function useInvoicesQuery(status?: InvoiceStatus) {
  return useQuery({
    queryKey: queryKeys.invoices.list(status),
    queryFn: () => getInvoices(status),
  });
}

export function useInvoiceQuery(id: string | null | undefined) {
  return useQuery({
    queryKey: id ? queryKeys.invoices.detail(id) : ["invoices", "detail", "empty"],
    queryFn: () => {
      if (!id) throw new Error("Invoice ID required");
      return getInvoiceById(id);
    },
    enabled: Boolean(id),
  });
}

export function useCustomerInvoicesQuery(customerId: string | null | undefined) {
  return useQuery({
    queryKey: customerId
      ? queryKeys.invoices.byCustomer(customerId)
      : ["invoices", "customer", "empty"],
    queryFn: () => {
      if (!customerId) return [];
      return getInvoicesByCustomerId(customerId);
    },
    enabled: Boolean(customerId),
  });
}

export function useSaveInvoiceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: InvoiceInput) => saveInvoiceDraft(input),
    onSuccess: (saved: Invoice) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.all });
      if (saved?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.invoices.detail(saved.id) });
      }
      if (saved?.customerId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.invoices.byCustomer(saved.customerId),
        });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
    },
  });
}

export function useSendInvoiceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: InvoiceInput) => sendInvoice(input),
    onSuccess: (sent: Invoice) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.all });
      if (sent?.id) {
        queryClient.invalidateQueries({ queryKey: queryKeys.invoices.detail(sent.id) });
      }
      if (sent?.customerId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.invoices.byCustomer(sent.customerId),
        });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
    },
  });
}

export function useMarkInvoicePaidMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markInvoiceAsPaid(id),
    onSuccess: (updated: Invoice, id: string) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.detail(id) });
      if (updated?.customerId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.invoices.byCustomer(updated.customerId),
        });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
    },
  });
}

export function useMarkInvoiceUnpaidMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markInvoiceAsUnpaid(id),
    onSuccess: (updated: Invoice, id: string) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.detail(id) });
      if (updated?.customerId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.invoices.byCustomer(updated.customerId),
        });
      }
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
    },
  });
}

export function useDeleteInvoiceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteInvoice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
    },
  });
}

export function useResendInvoiceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => resendInvoice(id),
    onSuccess: (_resent: Invoice, id: string) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices.detail(id) });
    },
  });
}
