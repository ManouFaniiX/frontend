import { apiClient } from "@/shared/api/client"
import type { InvoicePayload } from "@/interfaces/invoice/invoice-types"

export const invoiceService = {
  getAll: async () => {
    const response = await apiClient.get("/factures")
    return response.data
  },
  create: async (payload: InvoicePayload) => {
    const response = await apiClient.post("/factures", payload)
    return response.data
  },
  update: async (id: string, payload: InvoicePayload) => {
    const response = await apiClient.put(`/factures/${id}`, payload)
    return response.data
  },
  delete: async (id: string) => {
    const response = await apiClient.delete(`/factures/${id}`)
    return response.data
  },
}
