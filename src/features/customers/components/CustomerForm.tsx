"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCreateCustomer, useUpdateCustomer } from "@/features/customers/hooks/useCustomers"
import type { Customer, CustomerPayload } from "@/interfaces/customer/customer-types"

interface CustomerFormProps {
  customer?: Customer
  onSuccess?: () => void
  onCancel?: () => void
}

export function CustomerForm({ customer, onSuccess, onCancel }: CustomerFormProps) {
  const createMutation = useCreateCustomer()
  const updateMutation = useUpdateCustomer()
  const mutation = customer ? updateMutation : createMutation
  const [formData, setFormData] = useState<CustomerPayload>({
    nom: customer?.nom ?? "",
    email: customer?.email ?? "",
    telephone: customer?.telephone ?? "",
    adresse: customer?.adresse ?? "",
  })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const payload: CustomerPayload = {
      nom: formData.nom.trim(),
      email: formData.email?.trim() || undefined,
      telephone: formData.telephone?.trim() || undefined,
      adresse: formData.adresse?.trim() || undefined,
    }

    if (customer) {
      updateMutation.mutate({ id: customer.id, payload }, { onSuccess })
    } else {
      createMutation.mutate(payload, { onSuccess })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative space-y-5 text-card-foreground">
      <header className="border-b border-border pb-4 pr-10">
        <h2 id="customer-form-title" className="text-xl font-bold tracking-tight">
          {customer ? "Modifier le client" : "Nouveau client"}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {customer ? "Modifiez les informations du client." : "Ajoutez un nouveau client."}
        </p>
      </header>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Fermer le formulaire"
        onClick={onCancel}
        className="absolute right-0 top-0 text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
      >
        <X aria-hidden="true" size={19} />
      </Button>

      <div>
        <label htmlFor="customer-name" className="mb-1 block text-sm text-muted-foreground">Nom</label>
        <Input
          id="customer-name"
          value={formData.nom}
          onChange={(event) => setFormData({ ...formData, nom: event.target.value })}
          required
          maxLength={120}
          placeholder="Jean Dupont"
          className="bg-background text-foreground"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="customer-email" className="mb-1 block text-sm text-muted-foreground">E-mail</label>
          <Input
            id="customer-email"
            type="email"
            value={formData.email ?? ""}
            onChange={(event) => setFormData({ ...formData, email: event.target.value })}
            maxLength={254}
            placeholder="client@exemple.com"
            className="bg-background text-foreground"
          />
        </div>
        <div>
          <label htmlFor="customer-phone" className="mb-1 block text-sm text-muted-foreground">Téléphone</label>
          <Input
            id="customer-phone"
            type="tel"
            value={formData.telephone ?? ""}
            onChange={(event) => setFormData({ ...formData, telephone: event.target.value })}
            maxLength={30}
            placeholder="+261 00 000 00 00"
            className="bg-background text-foreground"
          />
        </div>
      </div>

      <div>
        <label htmlFor="customer-address" className="mb-1 block text-sm text-muted-foreground">Adresse</label>
        <textarea
          id="customer-address"
          value={formData.adresse ?? ""}
          onChange={(event) => setFormData({ ...formData, adresse: event.target.value })}
          rows={3}
          maxLength={250}
          placeholder="Adresse du client"
          className="w-full resize-y rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>

      {mutation.isError && (
        <p role="alert" className="text-sm text-destructive">
          L’enregistrement du client a échoué. Vérifiez les informations et réessayez.
        </p>
      )}

      <div className="flex justify-end gap-2 border-t border-border pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="border-border text-foreground">Annuler</Button>
        <Button type="submit" disabled={mutation.isPending} className="bg-primary text-primary-foreground hover:bg-primary/90">
          {mutation.isPending ? "Enregistrement…" : customer ? "Enregistrer" : "Créer le client"}
        </Button>
      </div>
    </form>
  )
}
