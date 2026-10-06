"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCategories, useCreateCategory, useUpdateCategory } from "@/features/categories/hooks/useCategories"
import type { Category, CategoryPayload } from "@/interfaces/category/category-types"

interface CategoryFormProps {
  category?: Category
  onSuccess?: () => void
  onCancel?: () => void
}

export function CategoryForm({ category, onSuccess, onCancel }: CategoryFormProps) {
  const createMutation = useCreateCategory()
  const updateMutation = useUpdateCategory()
  const { categories } = useCategories()
  const mutation = category ? updateMutation : createMutation
  const [formData, setFormData] = useState<CategoryPayload>({
    nom: category?.nom ?? "",
    code: category?.code ?? "",
    description: category?.description ?? "",
    parentId: category?.parentId ?? "",
  })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const code = formData.code.trim()
    const nom = formData.nom.trim()
    if (!code || !nom) return

    const payload = {
      ...formData,
      code,
      nom,
      description: formData.description?.trim() || undefined,
      parentId: formData.parentId || undefined,
    }
    const close = () => onSuccess?.()

    if (category) {
      updateMutation.mutate({ id: category.id, payload }, { onSuccess: close })
    } else {
      createMutation.mutate(payload, { onSuccess: close })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative space-y-5 text-card-foreground">
      <header className="border-b border-border pb-4 pr-10">
        <h2 id="category-form-title" className="text-xl font-bold tracking-tight">
          {category ? "Modifier la catégorie" : "Nouvelle catégorie"}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {category ? "Modifiez les informations de la catégorie." : "Créez une nouvelle catégorie de produits."}
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

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="category-code" className="mb-1 block text-sm text-muted-foreground">Code <span className="text-primary">*</span></label>
          <Input
            id="category-code"
            value={formData.code ?? ""}
            onChange={(event) => setFormData({ ...formData, code: event.target.value.replace(/^\s+/, "") })}
            required
            maxLength={30}
            placeholder="CAT01"
            className="bg-background text-foreground"
          />
        </div>
        <div>
          <label htmlFor="category-name" className="mb-1 block text-sm text-muted-foreground">Nom <span className="text-primary">*</span></label>
          <Input
            id="category-name"
            value={formData.nom}
            onChange={(event) => setFormData({ ...formData, nom: event.target.value.replace(/^\s+/, "") })}
            required
            maxLength={100}
            placeholder="Alimentaire"
            className="bg-background text-foreground"
          />
        </div>
      </div>

      <div>
        <label htmlFor="category-parent" className="mb-1 block text-sm text-muted-foreground">Catégorie parente</label>
        <select
          id="category-parent"
          value={formData.parentId ?? ""}
          onChange={(event) => setFormData({ ...formData, parentId: event.target.value })}
          className="h-10 w-full rounded-lg border border-border bg-background px-3 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <option value="">Aucune (catégorie racine)</option>
          {categories
            .filter((item) => item.id !== category?.id)
            .map((item) => <option key={item.id} value={item.id}>{item.nom}</option>)}
        </select>
      </div>

      <div>
        <label htmlFor="category-description" className="mb-1 block text-sm text-muted-foreground">Description</label>
        <textarea
          id="category-description"
          value={formData.description ?? ""}
          onChange={(event) => setFormData({ ...formData, description: event.target.value })}
          rows={3}
          maxLength={500}
          placeholder="Description facultative"
          className="w-full resize-y rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>

      {mutation.isError && (
        <p role="alert" className="text-sm text-destructive">
          L’enregistrement de la catégorie a échoué. Veuillez réessayer.
        </p>
      )}

      <footer className="flex justify-end gap-2 border-t border-border pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="border-border text-foreground">Annuler</Button>
        <Button type="submit" disabled={mutation.isPending} className="bg-primary text-primary-foreground hover:bg-primary/90">
          {mutation.isPending ? "Enregistrement…" : category ? "Enregistrer" : "Créer la catégorie"}
        </Button>
      </footer>
    </form>
  )
}
