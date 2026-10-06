"use client"

import { useDeferredValue, useEffect, useState } from "react"
import { MapPin, Pencil, Plus, Search, Trash2, Truck } from "lucide-react"

import { AppSidebar } from "@/components/AppSidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SupplierForm } from "@/features/suppliers/components/SupplierForm"
import { useDeleteSupplier, useSuppliers } from "@/features/suppliers/hooks/useSuppliers"
import type { Supplier } from "@/interfaces/supplier/supplier-types"

export default function SuppliersPage() {
  const [search, setSearch] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editingSupplier, setEditingSupplier] = useState<Supplier | undefined>()
  const deferredSearch = useDeferredValue(search.trim().toLocaleLowerCase("fr"))
  const { suppliers, isLoading, isError } = useSuppliers()
  const deleteMutation = useDeleteSupplier()
  const modalOpen = formOpen

  useEffect(() => {
    if (!modalOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFormOpen(false)
        setEditingSupplier(undefined)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [modalOpen])

  const visibleSuppliers = (suppliers as Supplier[]).filter((supplier) =>
    [supplier.nom, supplier.email ?? "", supplier.telephone ?? ""].some((value) =>
      value.toLocaleLowerCase("fr").includes(deferredSearch),
    ),
  )

  const openCreateForm = () => {
    setEditingSupplier(undefined)
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditingSupplier(undefined)
  }

  const deleteSupplier = (supplier: Supplier) => {
    if (window.confirm(`Supprimer le fournisseur « ${supplier.nom} » ?`)) {
      deleteMutation.mutate(supplier.id)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground lg:grid lg:grid-cols-[250px_minmax(0,1fr)]">
      <AppSidebar active="suppliers" />

      <main className="min-w-0 px-4 py-6 sm:px-6 lg:col-start-2 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-[1440px] space-y-6">
          <header className="flex flex-wrap items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                <Truck aria-hidden="true" size={26} />
              </span>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Fournisseurs</h1>
                <p className="mt-1 text-sm text-muted-foreground sm:text-base">Gérez vos fournisseurs et leurs coordonnées.</p>
              </div>
            </div>
            <Button onClick={openCreateForm} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus aria-hidden="true" size={18} /> Nouveau fournisseur
            </Button>
          </header>

          <label className="relative block max-w-[400px]">
            <span className="sr-only">Rechercher un fournisseur par nom, e-mail ou téléphone</span>
            <Search aria-hidden="true" size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher par nom, e-mail ou téléphone…"
              className="h-12 border-border bg-card pl-10 text-foreground placeholder:text-muted-foreground"
            />
          </label>

          {deleteMutation.isError && (
            <p role="alert" className="rounded-xl border border-border bg-card p-4 text-sm text-destructive">
              La suppression du fournisseur a échoué. Veuillez réessayer.
            </p>
          )}

          <section aria-label="Liste des fournisseurs" className="overflow-hidden rounded-2xl border border-border bg-card">
            {isError ? (
              <div role="alert" className="p-8 text-center text-sm text-muted-foreground">
                Impossible de charger les fournisseurs. Vérifiez la connexion à l’API, puis actualisez la page.
              </div>
            ) : isLoading ? (
              <p className="p-8 text-center text-sm text-muted-foreground">Chargement des fournisseurs…</p>
            ) : visibleSuppliers.length === 0 ? (
              <div className="flex min-h-56 flex-col items-center justify-center px-6 py-10 text-center">
                <Truck aria-hidden="true" className="text-muted-foreground" size={30} />
                <p className="mt-3 font-medium">
                  {search ? "Aucun fournisseur ne correspond à votre recherche." : "Aucun fournisseur pour le moment."}
                </p>
                {!search && (
                  <Button onClick={openCreateForm} variant="outline" className="mt-4 border-border text-foreground">
                    <Plus aria-hidden="true" size={16} /> Ajouter un fournisseur
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] border-collapse text-left">
                  <thead className="bg-secondary/60 text-xs font-semibold uppercase tracking-wide text-secondary-foreground">
                    <tr>
                      <th scope="col" className="px-5 py-4">Nom</th>
                      <th scope="col" className="px-5 py-4">E-mail</th>
                      <th scope="col" className="px-5 py-4">Téléphone</th>
                      <th scope="col" className="px-5 py-4">Adresse</th>
                      <th scope="col" className="px-5 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {visibleSuppliers.map((supplier) => (
                      <tr key={supplier.id} className="transition-colors hover:bg-secondary/30">
                        <th scope="row" className="px-5 py-4 font-medium">
                          <span className="flex items-center gap-3">
                            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                              <Truck aria-hidden="true" size={18} />
                            </span>
                            <span className="max-w-64 truncate">{supplier.nom}</span>
                          </span>
                        </th>
                        <td className="px-5 py-4 text-sm">
                          {supplier.email
                            ? <a className="text-primary hover:underline" href={`mailto:${supplier.email}`}><span className="sr-only">Envoyer un e-mail à </span>{supplier.email}</a>
                            : <span className="text-muted-foreground">—</span>}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-sm">
                          {supplier.telephone
                            ? <a className="hover:text-primary" href={`tel:${supplier.telephone}`}><span className="sr-only">Appeler </span>{supplier.telephone}</a>
                            : <span className="text-muted-foreground">—</span>}
                        </td>
                        <td className="max-w-72 px-5 py-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-2">
                            {supplier.adresse && <MapPin aria-hidden="true" className="shrink-0" size={15} />}
                            <span className="truncate">{supplier.adresse || "—"}</span>
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              aria-label={`Modifier ${supplier.nom}`}
                              onClick={() => { setEditingSupplier(supplier); setFormOpen(true) }}
                              className="text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                            >
                              <Pencil aria-hidden="true" size={17} />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              aria-label={`Supprimer ${supplier.nom}`}
                              disabled={deleteMutation.isPending}
                              onClick={() => deleteSupplier(supplier)}
                              className="text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                            >
                              <Trash2 aria-hidden="true" size={17} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
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
            aria-labelledby="supplier-form-title"
            className="my-auto w-full max-w-xl rounded-2xl border border-border bg-background p-5 shadow-2xl sm:p-7"
          >
            <SupplierForm
              key={editingSupplier?.id ?? "new-supplier"}
              supplier={editingSupplier}
              onSuccess={closeForm}
              onCancel={closeForm}
            />
          </section>
        </div>
      )}
    </div>
  )
}
