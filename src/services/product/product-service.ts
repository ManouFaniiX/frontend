import { 
  genericGetList, 
  genericGetOne, 
  genericCreate, 
  genericUpdate, 
  genericDelete 
} from "@/shared/api";
import type { Product, ProductPayload, ProductSearchParams } from "@/interfaces/product/product-types";

export const productService = {
  getAll: (params?: ProductSearchParams) => 
    genericGetList<Product, ProductSearchParams>("/produits", params),

  getById: (id: string) => 
    genericGetOne<Product>("/produits", id),

  create: (payload: ProductPayload) => 
    genericCreate<ProductPayload, Product>("/produits", payload),

  update: (id: string, payload: ProductPayload) => 
    genericUpdate<ProductPayload, Product>("/produits", id, payload),

  delete: (id: string) => 
    genericDelete("/produits", id),
};