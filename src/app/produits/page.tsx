"use client"

import { useDeferredValue, useState } from "react"
import { Package, Pencil, Plus, Search, Trash2, X } from "lucide-react"

import { AppSidebar } from "@/components/AppSidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ProductForm } from "@/features/products/components/ProductForm"
import { useDeleteProduct, useProducts } from "@/features/products/hooks/useProducts"
import { useCategories } from "@/features/categories/hooks/useCategories"
import { useSuppliers } from "@/features/suppliers/hooks/useSuppliers"
import type { Category } from "@/interfaces/category/category-types"
import type { Product } from "@/interfaces/product/product-types"
import type { Supplier } from "@/interfaces/supplier/supplier-types"

const LOW_STOCK_LIMIT = 10

function formatAr(value: number) {
  return `${new Intl.NumberFormat("fr-FR").format(value)} Ar`
}

export default function ProductsPage() {
  const [search, setSearch] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | undefined>()
  const deferredSearch = useDeferredValue(search)
  const { products, isLoading, isError } = useProducts({
    search: deferredSearch.trim() || undefined,
    categoryId: categoryId || undefined,
  })
  const { categories, isError: categoriesError } = useCategories()
  const { suppliers } = useSuppliers()
  const deleteMutation = useDeleteProduct()
  const categoryById = new Map((categories as Category[]).map((category) => [category.id, category.nom]))
  const supplierById = new Map((suppliers as Supplier[]).map((supplier) => [supplier.id, supplier.nom]))

  const openCreateForm = () => {
    setEditingProduct(undefined)
    setFormOpen(true)
  }

  const openEditForm = (product: Product) => {
    setEditingProduct(product)
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditingProduct(undefined)
  }

  const deleteProduct = (product: Product) => {
    if (window.confirm(`Supprimer le produit « ${product.nom} » ?`)) {
      deleteMutation.mutate(product.id)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground lg:grid lg:grid-cols-[250px_minmax(0,1fr)]">
      <AppSidebar active="products" />

      <main className="min-w-0 px-4 py-6 sm:px-6 lg:col-start-2 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-[1440px] space-y-6">
          <header className="flex flex-wrap items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                <Package aria-hidden="true" size={26} />
              </span>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Produits</h1>
                <p className="mt-1 text-sm text-muted-foreground sm:text-base">Gérez votre catalogue de produits.</p>
              </div>
            </div>
            <Button onClick={openCreateForm} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus aria-hidden="true" size={18} /> Nouveau produit
            </Button>
          </header>

          {formOpen && (
            <ProductForm
              key={editingProduct?.id ?? "new-product"}
              product={editingProduct}
              onSuccess={closeForm}
            />
          )}

          <section aria-label="Filtres des produits" className="grid gap-3 sm:grid-cols-[minmax(240px,400px)_minmax(220px,1fr)]">
            <label className="relative block">
              <span className="sr-only">Rechercher un produit par nom ou code</span>
              <Search aria-hidden="true" size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Rechercher par nom ou code…"
                className="h-12 border-border bg-card pl-10 text-foreground placeholder:text-muted-foreground"
              />
            </label>
            <label>
              <span className="sr-only">Filtrer par catégorie</span>
              <select
                value={categoryId}
                onChange={(event) => setCategoryId(event.target.value)}
                className="h-12 w-full rounded-xl border border-border bg-card px-4 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <option value="">Toutes les catégories</option>
                {(categories as Category[]).map((category) => (
                  <option key={category.id} value={category.id}>{category.nom}</option>
                ))}
              </select>
            </label>
          </section>

          {categoriesError && (
            <p role="status" className="text-sm text-muted-foreground">
              Les catégories ne sont pas disponibles ; le filtre par catégorie est désactivé.
            </p>
          )}
          {deleteMutation.isError && (
            <p role="alert" className="rounded-xl border border-border bg-card p-4 text-sm text-destructive">
              La suppression du produit a échoué. Veuillez réessayer.
            </p>
          )}

          <section aria-label="Catalogue des produits" className="overflow-hidden rounded-2xl border border-border bg-card">
            {isError ? (
              <div role="alert" className="p-8 text-center text-sm text-muted-foreground">
                Impossible de charger les produits. Vérifiez la connexion à l’API, puis actualisez la page.
              </div>
            ) : isLoading ? (
              <p className="p-8 text-center text-sm text-muted-foreground">Chargement des produits…</p>
            ) : products.length === 0 ? (
              <div className="flex min-h-56 flex-col items-center justify-center px-6 py-10 text-center">
                <Package aria-hidden="true" className="text-muted-foreground" size={30} />
                <p className="mt-3 font-medium">{search || categoryId ? "Aucun produit ne correspond à votre recherche." : "Votre catalogue est vide."}</p>
                {!search && !categoryId && (
                  <Button onClick={openCreateForm} variant="outline" className="mt-4 border-border text-foreground">
                    <Plus aria-hidden="true" size={16} /> Ajouter un produit
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] border-collapse text-left">
                  <thead className="bg-secondary/60 text-xs font-semibold uppercase tracking-wide text-secondary-foreground">
                    <tr>
                      <th scope="col" className="px-5 py-4">Produit</th>
                      <th scope="col" className="px-5 py-4">Catégorie</th>
                      <th scope="col" className="px-5 py-4">Fournisseurs</th>
                      <th scope="col" className="px-5 py-4">Prix</th>
                      <th scope="col" className="px-5 py-4">Stock</th>
                      <th scope="col" className="px-5 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {products.map((product) => {
                      const isLowStock = product.stock <= LOW_STOCK_LIMIT
                      return (
                        <tr key={product.id} className="transition-colors hover:bg-secondary/30">
                          <th scope="row" className="px-5 py-4 font-medium">
                            <div className="flex items-center gap-3">
                              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                                <Package aria-hidden="true" size={19} />
                              </span>
                              <span className="min-w-0">
                                <span className="block truncate">{product.nom}</span>
                                {(product.code || product.description) && <span className="mt-0.5 block max-w-64 truncate text-xs font-normal text-muted-foreground">{product.code || product.description}</span>}
                              </span>
                            </div>
                          </th>
                          <td className="px-5 py-4 text-sm text-muted-foreground">
                            {product.categoryId ? categoryById.get(product.categoryId) ?? "Catégorie inconnue" : "—"}
                          </td>
                          <td className="max-w-56 px-5 py-4 text-sm text-muted-foreground">
                            {(product.supplierIds ?? []).map((id) => supplierById.get(id)).filter(Boolean).join(", ") || "—"}
                          </td>
                          <td className="whitespace-nowrap px-5 py-4 font-semibold tabular-nums">{formatAr(product.prix)}</td>
                          <td className="px-5 py-4">
                            <span className="inline-flex items-center gap-2 whitespace-nowrap">
                              <span className="font-medium tabular-nums">{product.stock}</span>
                              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${isLowStock ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                                {isLowStock ? "Stock faible" : "En stock"}
                              </span>
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex justify-end gap-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                aria-label={`Modifier ${product.nom}`}
                                onClick={() => openEditForm(product)}
                                className="text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                              >
                                <Pencil aria-hidden="true" size={17} />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                aria-label={`Supprimer ${product.nom}`}
                                disabled={deleteMutation.isPending}
                                onClick={() => deleteProduct(product)}
                                className="text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                              >
                                <Trash2 aria-hidden="true" size={17} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
