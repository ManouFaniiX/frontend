export interface CategoryPayload {
  nom: string;
  code: string;
  description?: string;
  parentId?: string;
}

export interface Category extends CategoryPayload {
  id: string;
}

export interface CategorySearchParams {
  search?: string;
  page?: number;
}
