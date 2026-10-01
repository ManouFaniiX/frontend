"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { categoryService } from "@/interfaces/category/category-service"
import type { CategoryPayload, CategorySearchParams } from "@/interfaces/category/category-types"

export const categoryKeys = {
  all: ["categories"] as const,
  list: (params?: CategorySearchParams) => [...categoryKeys.all, "list", params] as const,
}

export function useCategories(params?: CategorySearchParams) {
  const query = useQuery({
    queryKey: categoryKeys.list(params),
    queryFn: () => categoryService.getAll(params),
    placeholderData: (previousData) => previousData,
  })

  return { ...query, categories: query.data?.data ?? [], meta: query.data?.meta }
}

export function useCreateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: CategoryPayload) => categoryService.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: categoryKeys.all }),
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CategoryPayload }) =>
      categoryService.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: categoryKeys.all }),
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => categoryService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: categoryKeys.all }),
  })
}