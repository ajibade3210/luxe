"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import {
  convertLeadToCustomer,
  createLead,
  deleteLead,
  getLeadById,
  getLeads,
  getLeadsSummary,
  updateLeadStatus,
} from "@/services/api/leads.service";
import type { CreateLeadInput, LeadFilterStatus, LeadStatus } from "@/types";

export function useLeadsQuery(query?: string, status?: LeadFilterStatus) {
  return useQuery({
    queryKey: queryKeys.leads.list(query, status),
    queryFn: () => getLeads(query, status),
  });
}

export function useLeadsSummaryQuery() {
  return useQuery({
    queryKey: queryKeys.leads.summary(),
    queryFn: () => getLeadsSummary(),
  });
}

export function useLeadQuery(id: string | null | undefined) {
  return useQuery({
    queryKey: id ? queryKeys.leads.detail(id) : ["leads", "detail", "empty"],
    queryFn: () => {
      if (!id) throw new Error("Lead ID required");
      return getLeadById(id);
    },
    enabled: Boolean(id),
  });
}

export function useCreateLeadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateLeadInput) => createLead(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
    },
  });
}

export function useUpdateLeadStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: LeadStatus }) =>
      updateLeadStatus(id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
    },
  });
}

export function useConvertLeadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) => convertLeadToCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
    },
  });
}

export function useDeleteLeadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteLead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
    },
  });
}
