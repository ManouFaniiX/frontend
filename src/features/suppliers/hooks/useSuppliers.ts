"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { supplierService } from "@/interfaces/supplier/supplier-service"
import type { SupplierPayload } from "@/interfaces/supplier/supplier-types"

export const supplierKeys = {
  all: ["suppliers"] as const,
}

export function useSuppliers() {
  const query = useQuery({
    queryKey: supplierKeys.all,
    queryFn: () => supplierService.getAll(),
  })

  return { ...query, suppliers: query.data?.data ?? [] }
}

export function useCreateSupplier() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: SupplierPayload) => supplierService.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: supplierKeys.all }),
  })
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: SupplierPayload }) =>
      supplierService.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: supplierKeys.all }),
  })
}

export function useDeleteSupplier() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => supplierService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: supplierKeys.all }),
  })
}
