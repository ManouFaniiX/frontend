export interface CustomerPayload {
  nom: string;
  email?: string;
  telephone?: string;
  adresse?: string;
}

export interface Customer extends CustomerPayload {
  id: string;
}
