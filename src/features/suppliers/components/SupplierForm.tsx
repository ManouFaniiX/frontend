"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCreateSupplier, useUpdateSupplier } from "@/features/suppliers/hooks/useSuppliers"
import type { Supplier, SupplierPayload } from "@/interfaces/supplier/supplier-types"

interface SupplierFormProps {
  supplier?: Supplier
  onSuccess?: () => void
  onCancel?: () => void
}

export function SupplierForm({ supplier, onSuccess, onCancel }: SupplierFormProps) {
  const createMutation = useCreateSupplier()
  const updateMutation = useUpdateSupplier()
  const mutation = supplier ? updateMutation : createMutation
  const [formData, setFormData] = useState<SupplierPayload>({
    nom: supplier?.nom ?? "",
    email: supplier?.email ?? "",
    telephone: supplier?.telephone ?? "",
    adresse: supplier?.adresse ?? "",
  })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const payload: SupplierPayload = {
      nom: formData.nom.trim(),
      email: formData.email?.trim() || undefined,
      telephone: formData.telephone?.trim() || undefined,
      adresse: formData.adresse?.trim() || undefined,
    }

    if (supplier) {
      updateMutation.mutate({ id: supplier.id, payload }, { onSuccess })
    } else {
      createMutation.mutate(payload, { onSuccess })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative space-y-5 text-card-foreground">
      <header className="border-b border-border pb-4 pr-10">
        <h2 id="supplier-form-title" className="text-xl font-bold tracking-tight">
          {supplier ? "Modifier le fournisseur" : "Nouveau fournisseur"}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {supplier ? "Modifiez les coordonnées du fournisseur." : "Ajoutez un nouveau fournisseur."}
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
        <label htmlFor="supplier-name" className="mb-1 block text-sm text-muted-foreground">Nom <span className="text-primary">*</span></label>
        <Input
          id="supplier-name"
          value={formData.nom}
          onChange={(event) => setFormData({ ...formData, nom: event.target.value })}
          required
          maxLength={120}
          placeholder="Société ABC"
          className="bg-background text-foreground"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="supplier-email" className="mb-1 block text-sm text-muted-foreground">E-mail</label>
          <Input
            id="supplier-email"
            type="email"
            value={formData.email ?? ""}
            onChange={(event) => setFormData({ ...formData, email: event.target.value })}
            maxLength={254}
            placeholder="contact@exemple.com"
            className="bg-background text-foreground"
          />
        </div>
        <div>
          <label htmlFor="supplier-phone" className="mb-1 block text-sm text-muted-foreground">Téléphone</label>
          <Input
            id="supplier-phone"
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
        <label htmlFor="supplier-address" className="mb-1 block text-sm text-muted-foreground">Adresse</label>
        <textarea
          id="supplier-address"
          value={formData.adresse ?? ""}
          onChange={(event) => setFormData({ ...formData, adresse: event.target.value })}
          rows={3}
          maxLength={250}
          placeholder="Adresse du fournisseur"
          className="w-full resize-y rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>

      {mutation.isError && (
        <p role="alert" className="text-sm text-destructive">
          L’enregistrement du fournisseur a échoué. Vérifiez ses coordonnées et réessayez.
        </p>
      )}

      <footer className="flex justify-end gap-2 border-t border-border pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="border-border text-foreground">Annuler</Button>
        <Button type="submit" disabled={mutation.isPending} className="bg-primary text-primary-foreground hover:bg-primary/90">
          {mutation.isPending ? "Enregistrement…" : supplier ? "Enregistrer" : "Créer"}
        </Button>
      </footer>
    </form>
  )
}
