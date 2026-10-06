export interface Product {
  id: string;
  code?: string;
  nom: string;
  description?: string;
  prix: number;
  stock: number;
  categoryId?: string;
  supplierIds?: string[];
  createdAt?: string;
}

export interface ProductPayload {
  code: string;
  nom: string;
  description?: string;
  prix: number;
  stock: number;
  categoryId: string;
  supplierIds?: string[];
}

export interface ProductSearchParams {
  search?: string;
  page?: number;
  limit?: number;
  categoryId?: string;
}
