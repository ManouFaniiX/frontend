"use client"

import { useDeferredValue, useEffect, useState } from "react"
import { Pencil, Plus, Search, Tags, Trash2 } from "lucide-react"

import { AppSidebar } from "@/components/AppSidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CategoryForm } from "@/features/categories/components/CategoryForm"
import { useCategories, useDeleteCategory } from "@/features/categories/hooks/useCategories"
import { useProducts } from "@/features/products/hooks/useProducts"
import type { Category } from "@/interfaces/category/category-types"

export default function CategoriesPage() {
  const [search, setSearch] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | undefined>()
  const deferredSearch = useDeferredValue(search.trim().toLocaleLowerCase("fr"))
  const { categories, isLoading, isError } = useCategories()
  const { products, isLoading: productsLoading, isError: productsError } = useProducts()
  const deleteMutation = useDeleteCategory()
  const modalOpen = formOpen

  useEffect(() => {
    if (!modalOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFormOpen(false)
        setEditingCategory(undefined)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [modalOpen])

  const visibleCategories = (categories as Category[]).filter((category) =>
    [category.nom, category.code ?? ""].some((value) => value.toLocaleLowerCase("fr").includes(deferredSearch)),
  )
  const categoryById = new Map((categories as Category[]).map((category) => [category.id, category.nom]))
  const productCountByCategory = new Map<string, number>()
  for (const product of products) {
    if (product.categoryId) {
      productCountByCategory.set(product.categoryId, (productCountByCategory.get(product.categoryId) ?? 0) + 1)
    }
  }

  const openCreateForm = () => {
    setEditingCategory(undefined)
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditingCategory(undefined)
  }

  const deleteCategory = (category: Category) => {
    const productCount = productCountByCategory.get(category.id) ?? 0
    const subcategoryCount = (categories as Category[]).filter((item) => item.parentId === category.id).length
    const details = [
      !productsLoading && !productsError && productCount > 0 ? `${productCount} produit${productCount === 1 ? "" : "s"}` : "",
      subcategoryCount > 0 ? `${subcategoryCount} sous-catégorie${subcategoryCount === 1 ? "" : "s"}` : "",
    ].filter(Boolean).join(" et ")
    const message = productsLoading || productsError
      ? `Impossible de vérifier les produits liés à « ${category.nom} ». Voulez-vous quand même tenter de la supprimer ?`
      : details
      ? `La catégorie « ${category.nom} » contient ${details}. Voulez-vous quand même tenter de la supprimer ?`
      : `Supprimer la catégorie « ${category.nom} » ?`

    if (window.confirm(message)) deleteMutation.mutate(category.id)
  }

  return (
    <div className="min-h-screen bg-background text-foreground lg:grid lg:grid-cols-[250px_minmax(0,1fr)]">
      <AppSidebar active="categories" />

      <main className="min-w-0 px-4 py-6 sm:px-6 lg:col-start-2 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-[1440px] space-y-6">
          <header className="flex flex-wrap items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                <Tags aria-hidden="true" size={26} />
              </span>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Catégories</h1>
                <p className="mt-1 text-sm text-muted-foreground sm:text-base">Organisez vos produits par catégories et sous-catégories.</p>
              </div>
            </div>
            <Button onClick={openCreateForm} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus aria-hidden="true" size={18} /> Nouvelle catégorie
            </Button>
          </header>

          <label className="relative block max-w-[400px]">
            <span className="sr-only">Rechercher une catégorie par nom ou code</span>
            <Search aria-hidden="true" size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher par nom ou code…"
              className="h-12 border-border bg-card pl-10 text-foreground placeholder:text-muted-foreground"
            />
          </label>

          {deleteMutation.isError && (
            <p role="alert" className="rounded-xl border border-border bg-card p-4 text-sm text-destructive">
              Suppression impossible. Vérifiez que la catégorie ne contient plus de produits ni de sous-catégories.
            </p>
          )}
          {productsError && (
            <p role="status" className="text-sm text-muted-foreground">
              Les catégories sont affichées, mais le nombre de produits ne peut pas être chargé.
            </p>
          )}

          <section aria-label="Liste des catégories" className="overflow-hidden rounded-2xl border border-border bg-card">
            {isError ? (
              <div role="alert" className="p-8 text-center text-sm text-muted-foreground">
                Impossible de charger les catégories. Vérifiez la connexion à l’API, puis actualisez la page.
              </div>
            ) : isLoading ? (
              <p className="p-8 text-center text-sm text-muted-foreground">Chargement des catégories…</p>
            ) : visibleCategories.length === 0 ? (
              <div className="flex min-h-56 flex-col items-center justify-center px-6 py-10 text-center">
                <Tags aria-hidden="true" className="text-muted-foreground" size={30} />
                <p className="mt-3 font-medium">
                  {search ? "Aucune catégorie ne correspond à votre recherche." : "Aucune catégorie pour le moment."}
                </p>
                {!search && (
                  <Button onClick={openCreateForm} variant="outline" className="mt-4 border-border text-foreground">
                    <Plus aria-hidden="true" size={16} /> Créer une catégorie
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] border-collapse text-left">
                  <thead className="bg-secondary/60 text-xs font-semibold uppercase tracking-wide text-secondary-foreground">
                    <tr>
                      <th scope="col" className="px-5 py-4">Nom</th>
                      <th scope="col" className="px-5 py-4">Code</th>
                      <th scope="col" className="px-5 py-4">Description</th>
                      <th scope="col" className="px-5 py-4">Parent</th>
                      <th scope="col" className="px-5 py-4">Produits</th>
                      <th scope="col" className="px-5 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {visibleCategories.map((category) => {
                      const subcategoryCount = (categories as Category[]).filter((item) => item.parentId === category.id).length
                      const productCount = productCountByCategory.get(category.id) ?? 0
                      return (
                        <tr key={category.id} className="transition-colors hover:bg-secondary/30">
                          <th scope="row" className="px-5 py-4 font-medium">
                            <span className="block max-w-72 truncate">{category.nom}</span>
                            {subcategoryCount > 0 && (
                              <span className="mt-1 inline-flex rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                                {subcategoryCount} sous-catégorie{subcategoryCount === 1 ? "" : "s"}
                              </span>
                            )}
                          </th>
                          <td className="px-5 py-4 text-sm">
                            {category.code
                              ? <span className="rounded-full bg-secondary px-2.5 py-1 text-secondary-foreground">{category.code}</span>
                              : <span className="text-muted-foreground">—</span>}
                          </td>
                          <td className="max-w-64 px-5 py-4 text-sm text-muted-foreground">
                            <span className="block truncate">{category.description || "—"}</span>
                          </td>
                          <td className="max-w-64 px-5 py-4 text-sm text-muted-foreground">
                            <span className="block truncate">{category.parentId ? categoryById.get(category.parentId) ?? "Catégorie inconnue" : "—"}</span>
                          </td>
                          <td className="whitespace-nowrap px-5 py-4 text-sm font-medium">
                            {productsError ? "—" : productsLoading ? "…" : `${productCount} produit${productCount === 1 ? "" : "s"}`}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex justify-end gap-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                aria-label={`Modifier ${category.nom}`}
                                onClick={() => { setEditingCategory(category); setFormOpen(true) }}
                                className="text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                              >
                                <Pencil aria-hidden="true" size={17} />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                aria-label={`Supprimer ${category.nom}`}
                                disabled={deleteMutation.isPending}
                                onClick={() => deleteCategory(category)}
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

      {formOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[color-mix(in_srgb,var(--palette-espresso)_80%,transparent)] p-4 backdrop-blur-sm"
          onMouseDown={(event) => { if (event.target === event.currentTarget) closeForm() }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="category-form-title"
            className="my-auto w-full max-w-xl rounded-2xl border border-border bg-background p-5 shadow-2xl sm:p-7"
          >
            <CategoryForm
              key={editingCategory?.id ?? "new-category"}
              category={editingCategory}
              onSuccess={closeForm}
              onCancel={closeForm}
            />
          </section>
        </div>
      )}
    </div>
  )
}
