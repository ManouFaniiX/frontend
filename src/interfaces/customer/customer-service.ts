import { apiClient } from "@/shared/api/client"
import type { CustomerPayload } from "@/interfaces/customer/customer-types"

export const customerService = {
  getAll: async () => {
    const response = await apiClient.get("/clients")
    return response.data
  },
  create: async (payload: CustomerPayload) => {
    const response = await apiClient.post("/clients", payload)
    return response.data
  },
  update: async (id: string, payload: CustomerPayload) => {
    const response = await apiClient.put(`/clients/${id}`, payload)
    return response.data
  },
  delete: async (id: string) => {
    const response = await apiClient.delete(`/clients/${id}`)
    return response.data
  },
}
