export interface Product {
  id: string;
  nom: string;
  description?: string;
  prix: number;
  stock: number;
  categoryId?: string;
  createdAt?: string;
}

export interface ProductPayload {
  nom: string;
  description?: string;
  prix: number;
  stock: number;
  categoryId?: string;
}

export interface ProductSearchParams {
  search?: string;
  page?: number;
  limit?: number;
  categoryId?: string;
}   