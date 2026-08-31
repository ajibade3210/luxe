"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";
import {
  addServiceToCustomer,
  createCustomer,
  deleteCustomer,
  deleteCustomerService,
  getCustomer,
  getCustomers,
  importCustomers,
  toggleCustomerActiveStatus,
  updateCustomer,
  updateCustomerServiceStatus,
} from "@/services/api/customer.service";
import type {
  AddServiceInput,
  ImportCustomerRecord,
  NewCustomerInput,
  ServiceStatus,
} from "@/types";

export function useCustomersQuery(query?: string, isActive?: boolean) {
  return useQuery({
    queryKey: queryKeys.customers.list(query, isActive),
    queryFn: () => getCustomers(query, isActive),
  });
}

export function useCustomerQuery(id: string | null | undefined) {
  return useQuery({
    queryKey: id ? queryKeys.customers.detail(id) : ["customers", "detail", "empty"],
    queryFn: () => {
      if (!id) throw new Error("Customer ID required");
      return getCustomer(id);
    },
    enabled: Boolean(id),
  });
}

export function useCreateCustomerMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: NewCustomerInput) => createCustomer(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
    },
  });
}

export function useUpdateCustomerMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: Partial<NewCustomerInput> }) =>
      updateCustomer(id, input),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.detail(id) });
    },
  });
}

export function useToggleCustomerStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      toggleCustomerActiveStatus(id, isActive),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
    },
  });
}

export function useDeleteCustomerMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
    },
  });
}

export function useAddCustomerServiceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ customerId, input }: { customerId: string; input: AddServiceInput }) =>
      addServiceToCustomer(customerId, input),
    onSuccess: (_, { customerId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.detail(customerId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
    },
  });
}

export function useUpdateCustomerServiceStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      customerId,
      serviceId,
      status,
    }: {
      customerId: string;
      serviceId: string;
      status: ServiceStatus;
    }) => updateCustomerServiceStatus(customerId, serviceId, status),
    onSuccess: (_, { customerId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.detail(customerId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
    },
  });
}

export function useDeleteCustomerServiceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ customerId, serviceId }: { customerId: string; serviceId: string }) =>
      deleteCustomerService(customerId, serviceId),
    onSuccess: (_, { customerId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.detail(customerId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
    },
  });
}

export function useImportCustomersMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (records: ImportCustomerRecord[]) => importCustomers(records),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.analytics.all });
    },
  });
}
