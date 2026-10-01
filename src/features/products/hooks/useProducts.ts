"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { productService } from "@/services/product/product-service"
import type { ProductPayload, ProductSearchParams } from "@/interfaces/product/product-types"

export const productKeys = {
  all: ["products"] as const,
  list: (params?: ProductSearchParams) => [...productKeys.all, "list", params] as const,
}

export function useProducts(params?: ProductSearchParams) {
  const query = useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => productService.getAll(params),
    placeholderData: (previousData) => previousData,
  })

  return { ...query, products: query.data?.data ?? [], meta: query.data?.meta }
}

export function useCreateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: ProductPayload) => productService.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productKeys.all }),
  })
}

export function useUpdateProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ProductPayload }) =>
      productService.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productKeys.all }),
  })
}

export function useDeleteProduct() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => productService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: productKeys.all }),
  })
}