export interface CategoryPayload {
  nom: string;
  description?: string;
}

export interface CategorySearchParams {
  search?: string;
  page?: number;
}