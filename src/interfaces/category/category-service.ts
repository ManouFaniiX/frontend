import { apiClient } from "@/shared/api/client";
import type { CategoryPayload, CategorySearchParams } from "@/interfaces/category/category-types";

export const categoryService = {
  getAll: async (params?: CategorySearchParams) => {
    const response = await apiClient.get("/categories", { params });
    return response.data;
  },
  create: async (payload: CategoryPayload) => {
    const response = await apiClient.post("/categories", payload);
    return response.data;
  },
  update: async (id: string, payload: CategoryPayload) => {
    const response = await apiClient.put(`/categories/${id}`, payload);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await apiClient.delete(`/categories/${id}`);
    return response.data;
  },
};