import axios from "axios"
import { axiosCredential } from "@/lib/axios"
import type { AuthResponse, LoginCredentials } from "@/features/auth/types/auth.types"

export const authApi = {
  login: async (credentials: LoginCredentials) => {
    try {
      const response = await axiosCredential.post<AuthResponse>("/auth/login", credentials)
      if (response.data?.success === false) {
        throw new Error(response.data.message || "Adresse e-mail ou mot de passe incorrect.")
      }
      return response.data
    } catch (error) {
      if (axios.isAxiosError<AuthResponse>(error)) {
        throw new Error(error.response?.data?.message || "Adresse e-mail ou mot de passe incorrect.")
      }
      throw error
    }
  },
}
