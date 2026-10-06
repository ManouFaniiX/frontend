export type InvoiceStatus = "En attente" | "Payée" | "Annulée"

export interface InvoicePayload {
  clientId: string;
  montant: number;
  dateFacture: string;
  statut: InvoiceStatus;
}

export interface Invoice {
  id: string;
  numero: string;
  clientId?: string;
  client?: { id?: string; nom: string } | string;
  montant: number;
  statut: InvoiceStatus;
  dateFacture: string;
}
