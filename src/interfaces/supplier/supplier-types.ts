export interface SupplierPayload {
  nom: string;
  email?: string;
  telephone?: string;
  adresse?: string;
}

export interface Supplier extends SupplierPayload {
  id: string;
}
