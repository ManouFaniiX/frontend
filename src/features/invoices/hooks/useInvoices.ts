"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { invoiceService } from "@/interfaces/invoice/invoice-service"
import type { InvoicePayload } from "@/interfaces/invoice/invoice-types"

export const invoiceKeys = {
  all: ["invoices"] as const,
}

export function useInvoices() {
  const query = useQuery({
    queryKey: invoiceKeys.all,
    queryFn: () => invoiceService.getAll(),
  })

  return { ...query, invoices: query.data?.data ?? [] }
}

export function useCreateInvoice() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: InvoicePayload) => invoiceService.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: invoiceKeys.all }),
  })
}

export function useUpdateInvoice() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: InvoicePayload }) =>
      invoiceService.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: invoiceKeys.all }),
  })
}

export function useDeleteInvoice() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => invoiceService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: invoiceKeys.all }),
  })
}
