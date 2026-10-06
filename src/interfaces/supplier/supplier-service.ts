import { apiClient } from "@/shared/api/client"
import type { SupplierPayload } from "@/interfaces/supplier/supplier-types"

export const supplierService = {
  getAll: async () => {
    const response = await apiClient.get("/fournisseurs")
    return response.data
  },
  create: async (payload: SupplierPayload) => {
    const response = await apiClient.post("/fournisseurs", payload)
    return response.data
  },
  update: async (id: string, payload: SupplierPayload) => {
    const response = await apiClient.put(`/fournisseurs/${id}`, payload)
    return response.data
  },
  delete: async (id: string) => {
    const response = await apiClient.delete(`/fournisseurs/${id}`)
    return response.data
  },
}
