"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCustomers } from "@/features/customers/hooks/useCustomers"
import { useCreateInvoice, useUpdateInvoice } from "@/features/invoices/hooks/useInvoices"
import type { Customer } from "@/interfaces/customer/customer-types"
import type { Invoice, InvoicePayload, InvoiceStatus } from "@/interfaces/invoice/invoice-types"

interface InvoiceFormProps {
  invoice?: Invoice
  onSuccess?: () => void
  onCancel?: () => void
}

function localDateValue() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function invoiceClientId(invoice?: Invoice) {
  if (invoice?.clientId) return invoice.clientId
  return invoice?.client && typeof invoice.client === "object" ? invoice.client.id ?? "" : ""
}

export function InvoiceForm({ invoice, onSuccess, onCancel }: InvoiceFormProps) {
  const { customers, isLoading: customersLoading, isError: customersError } = useCustomers()
  const createMutation = useCreateInvoice()
  const updateMutation = useUpdateInvoice()
  const mutation = invoice ? updateMutation : createMutation
  const [formData, setFormData] = useState<InvoicePayload>({
    clientId: invoiceClientId(invoice),
    montant: invoice?.montant ?? 0,
    dateFacture: invoice?.dateFacture?.slice(0, 10) ?? localDateValue(),
    statut: invoice?.statut ?? "En attente",
  })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const payload = { ...formData, montant: Number(formData.montant) }
    if (invoice) {
      updateMutation.mutate({ id: invoice.id, payload }, { onSuccess })
    } else {
      createMutation.mutate(payload, { onSuccess })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <header className="border-b border-border pb-4">
        <h2 id="invoice-form-title" className="text-xl font-bold tracking-tight">
          {invoice ? "Modifier la facture" : "Nouvelle facture"}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {invoice ? "Modifiez les informations de la facture." : "Créez une nouvelle facture pour un client."}
        </p>
      </header>

      <div>
        <label htmlFor="invoice-customer" className="mb-1.5 block text-sm font-medium">Client <span className="text-primary">*</span></label>
        <select
          id="invoice-customer"
          value={formData.clientId}
          onChange={(event) => setFormData({ ...formData, clientId: event.target.value })}
          required
          disabled={customersLoading || customersError || customers.length === 0}
          className="h-11 w-full rounded-xl border border-border bg-background px-3 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-60"
        >
          <option value="">{customersLoading ? "Chargement des clients…" : "Sélectionner un client"}</option>
          {(customers as Customer[]).map((customer) => (
            <option key={customer.id} value={customer.id}>{customer.nom}</option>
          ))}
        </select>
        {customersError && <p role="alert" className="mt-2 text-sm text-destructive">Impossible de charger la liste des clients.</p>}
        {!customersLoading && !customersError && customers.length === 0 && (
          <p className="mt-2 text-sm text-muted-foreground">Créez d’abord un client avant d’établir une facture.</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="invoice-amount" className="mb-1.5 block text-sm font-medium">Montant total (Ar) <span className="text-primary">*</span></label>
          <Input
            id="invoice-amount"
            type="number"
            min="1"
            step="1"
            value={formData.montant}
            onChange={(event) => setFormData({ ...formData, montant: Number(event.target.value) })}
            required
            className="h-11 rounded-xl bg-background text-foreground"
          />
        </div>
        <div>
          <label htmlFor="invoice-date" className="mb-1.5 block text-sm font-medium">Date de facturation <span className="text-primary">*</span></label>
          <Input
            id="invoice-date"
            type="date"
            value={formData.dateFacture}
            onChange={(event) => setFormData({ ...formData, dateFacture: event.target.value })}
            required
            className="h-11 rounded-xl bg-background text-foreground"
          />
        </div>
      </div>

      <div>
        <label htmlFor="invoice-status" className="mb-1.5 block text-sm font-medium">Statut</label>
        <select
          id="invoice-status"
          value={formData.statut}
          onChange={(event) => setFormData({ ...formData, statut: event.target.value as InvoiceStatus })}
          className="h-11 w-full rounded-xl border border-border bg-background px-3 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <option value="En attente">En attente</option>
          <option value="Payée">Payée</option>
          <option value="Annulée">Annulée</option>
        </select>
      </div>

      {mutation.isError && (
        <p role="alert" className="text-sm text-destructive">
          L’enregistrement de la facture a échoué. Vérifiez les informations et réessayez.
        </p>
      )}

      <footer className="flex justify-end gap-2 border-t border-border pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="border-border text-foreground">Annuler</Button>
        <Button type="submit" disabled={mutation.isPending || customers.length === 0} className="bg-primary text-primary-foreground hover:bg-primary/90">
          {mutation.isPending ? "Enregistrement…" : invoice ? "Enregistrer" : "Créer"}
        </Button>
      </footer>
    </form>
  )
}
