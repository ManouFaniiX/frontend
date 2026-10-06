"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { customerService } from "@/interfaces/customer/customer-service"
import type { CustomerPayload } from "@/interfaces/customer/customer-types"

export const customerKeys = {
  all: ["customers"] as const,
}

export function useCustomers() {
  const query = useQuery({
    queryKey: customerKeys.all,
    queryFn: () => customerService.getAll(),
  })

  return { ...query, customers: query.data?.data ?? [] }
}

export function useCreateCustomer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CustomerPayload) => customerService.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: customerKeys.all }),
  })
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CustomerPayload }) =>
      customerService.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: customerKeys.all }),
  })
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => customerService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: customerKeys.all }),
  })
}
