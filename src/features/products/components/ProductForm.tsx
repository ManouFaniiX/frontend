"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCategories } from "@/features/categories/hooks/useCategories"
import { useCreateProduct, useUpdateProduct } from "@/features/products/hooks/useProducts"
import { useSuppliers } from "@/features/suppliers/hooks/useSuppliers"
import type { Category } from "@/interfaces/category/category-types"
import type { Product, ProductPayload } from "@/interfaces/product/product-types"
import type { Supplier } from "@/interfaces/supplier/supplier-types"

interface ProductFormProps {
  onSuccess?: () => void
  onCancel?: () => void
  product?: Product
}

export function ProductForm({ onSuccess, onCancel, product }: ProductFormProps) {
  const createMutation = useCreateProduct()
  const updateMutation = useUpdateProduct()
  const { categories, isLoading: categoriesLoading, isError: categoriesError } = useCategories()
  const { suppliers, isLoading: suppliersLoading, isError: suppliersError } = useSuppliers()
  const mutation = product ? updateMutation : createMutation
  const close = onCancel ?? onSuccess
  const [formData, setFormData] = useState<ProductPayload>({
    code: product?.code ?? "",
    nom: product?.nom ?? "",
    description: product?.description ?? "",
    prix: product?.prix ?? 0,
    stock: product?.stock ?? 0,
    categoryId: product?.categoryId ?? "",
    supplierIds: product?.supplierIds ?? [],
  })

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close?.()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [close])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const code = formData.code.trim()
    const nom = formData.nom.trim()
    if (!code || !nom || !formData.categoryId) return

    const payload: ProductPayload = {
      ...formData,
      code,
      nom,
      description: formData.description?.trim() || undefined,
      supplierIds: formData.supplierIds ?? [],
    }
    const onSaved = () => onSuccess?.()

    if (product) {
      updateMutation.mutate({ id: product.id, payload }, { onSuccess: onSaved })
    } else {
      createMutation.mutate(payload, { onSuccess: onSaved })
    }
  }

  const toggleSupplier = (supplierId: string) => {
    const current = formData.supplierIds ?? []
    setFormData({
      ...formData,
      supplierIds: current.includes(supplierId)
        ? current.filter((id) => id !== supplierId)
        : [...current, supplierId],
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[color-mix(in_srgb,var(--palette-espresso)_80%,transparent)] p-4 backdrop-blur-sm"
      onMouseDown={(event) => { if (event.target === event.currentTarget) close?.() }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-form-title"
        className="relative my-auto w-full max-w-3xl rounded-2xl border border-border bg-background p-5 shadow-2xl sm:p-7"
      >
        <form onSubmit={handleSubmit} className="relative space-y-5 text-card-foreground">
          <header className="border-b border-border pb-4 pr-10">
            <h2 id="product-form-title" className="text-xl font-bold tracking-tight">
              {product ? "Modifier le produit" : "Nouveau produit"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {product ? "Modifiez les informations du produit." : "Ajoutez un nouveau produit."}
            </p>
          </header>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Fermer le formulaire"
            onClick={close}
            className="absolute right-0 top-0 text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
          >
            <X aria-hidden="true" size={19} />
          </Button>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="product-code" className="mb-1 block text-sm text-muted-foreground">Code <span className="text-primary">*</span></label>
              <Input
                id="product-code"
                value={formData.code}
                onChange={(event) => setFormData({ ...formData, code: event.target.value.replace(/^\s+/, "") })}
                required
                maxLength={40}
                placeholder="PRD-001"
                className="bg-background text-foreground"
              />
            </div>
            <div>
              <label htmlFor="product-name" className="mb-1 block text-sm text-muted-foreground">Nom <span className="text-primary">*</span></label>
              <Input
                id="product-name"
                value={formData.nom}
                onChange={(event) => setFormData({ ...formData, nom: event.target.value.replace(/^\s+/, "") })}
                required
                maxLength={120}
                placeholder="Riz parfumé 5 kg"
                className="bg-background text-foreground"
              />
            </div>
          </div>

          <div>
            <label htmlFor="product-description" className="mb-1 block text-sm text-muted-foreground">Description</label>
            <textarea
              id="product-description"
              value={formData.description ?? ""}
              onChange={(event) => setFormData({ ...formData, description: event.target.value })}
              rows={3}
              maxLength={500}
              placeholder="Description du produit"
              className="w-full resize-y rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label htmlFor="product-price" className="mb-1 block text-sm text-muted-foreground">Prix (Ar) <span className="text-primary">*</span></label>
              <Input
                id="product-price"
                type="number"
                min="0"
                step="1"
                value={formData.prix}
                onChange={(event) => setFormData({ ...formData, prix: Number(event.target.value) })}
                required
                className="bg-background text-foreground"
              />
            </div>
            <div>
              <label htmlFor="product-stock" className="mb-1 block text-sm text-muted-foreground">Stock</label>
              <Input
                id="product-stock"
                type="number"
                min="0"
                step="1"
                value={formData.stock}
                onChange={(event) => setFormData({ ...formData, stock: Number(event.target.value) })}
                className="bg-background text-foreground"
              />
            </div>
            <div>
              <label htmlFor="product-category" className="mb-1 block text-sm text-muted-foreground">Catégorie <span className="text-primary">*</span></label>
              <select
                id="product-category"
                value={formData.categoryId}
                onChange={(event) => setFormData({ ...formData, categoryId: event.target.value })}
                required
                disabled={categoriesLoading || categoriesError || categories.length === 0}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:opacity-60"
              >
                <option value="">{categoriesLoading ? "Chargement…" : "Sélectionner…"}</option>
                {(categories as Category[]).map((category) => (
                  <option key={category.id} value={category.id}>{category.nom}</option>
                ))}
              </select>
              {categoriesError && <p role="alert" className="mt-1 text-xs text-destructive">Impossible de charger les catégories.</p>}
              {!categoriesLoading && !categoriesError && categories.length === 0 && (
                <p role="alert" className="mt-1 text-xs text-destructive">Créez d’abord une catégorie.</p>
              )}
            </div>
          </div>

          <fieldset>
            <legend className="mb-2 text-sm text-muted-foreground">Fournisseurs</legend>
            <div className="max-h-32 space-y-1 overflow-y-auto rounded-xl border border-border bg-background p-3">
              {suppliersLoading ? (
                <p className="text-sm text-muted-foreground">Chargement des fournisseurs…</p>
              ) : suppliersError ? (
                <p role="status" className="text-sm text-muted-foreground">La liste des fournisseurs n’est pas disponible.</p>
              ) : suppliers.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucun fournisseur disponible.</p>
              ) : (
                (suppliers as Supplier[]).map((supplier) => (
                  <label key={supplier.id} className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-secondary/60">
                    <input
                      type="checkbox"
                      checked={(formData.supplierIds ?? []).includes(supplier.id)}
                      onChange={() => toggleSupplier(supplier.id)}
                      className="size-4 accent-primary"
                    />
                    {supplier.nom}
                  </label>
                ))
              )}
            </div>
          </fieldset>

          {mutation.isError && (
            <p role="alert" className="text-sm text-destructive">
              L’enregistrement du produit a échoué. Vérifiez les informations et réessayez.
            </p>
          )}

          <footer className="flex justify-end gap-2 border-t border-border pt-4">
            <Button type="button" variant="outline" onClick={close} className="border-border text-foreground">Annuler</Button>
            <Button
              type="submit"
              disabled={mutation.isPending || categoriesLoading || categoriesError || categories.length === 0}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {mutation.isPending ? "Enregistrement…" : product ? "Enregistrer" : "Créer"}
            </Button>
          </footer>
        </form>
      </section>
    </div>
  )
}

export default ProductForm
