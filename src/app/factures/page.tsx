"use client"

import { useDeferredValue, useEffect, useState } from "react"
import { Eye, FileText, Pencil, Plus, Search, Trash2, X } from "lucide-react"

import { AppSidebar } from "@/components/AppSidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCustomers } from "@/features/customers/hooks/useCustomers"
import { InvoiceForm } from "@/features/invoices/components/InvoiceForm"
import { useDeleteInvoice, useInvoices } from "@/features/invoices/hooks/useInvoices"
import type { Customer } from "@/interfaces/customer/customer-types"
import type { Invoice, InvoiceStatus } from "@/interfaces/invoice/invoice-types"

type StatusFilter = "Tous les statuts" | InvoiceStatus

const STATUSES: InvoiceStatus[] = ["En attente", "Payée", "Annulée"]

function formatAr(value: number) {
  return `${new Intl.NumberFormat("fr-FR").format(value)} Ar`
}

function formatDate(value: string) {
  if (!value) return "—"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "—"
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date)
}

function customerName(invoice: Invoice, customers: Customer[]) {
  if (typeof invoice.client === "object" && invoice.client?.nom) return invoice.client.nom
  if (typeof invoice.client === "string" && invoice.client) return invoice.client
  return customers.find((customer) => customer.id === invoice.clientId)?.nom ?? "—"
}

function statusStyle(status: InvoiceStatus) {
  if (status === "Payée") return "bg-secondary text-secondary-foreground"
  if (status === "Annulée") return "bg-card text-muted-foreground border border-border"
  return "bg-primary text-primary-foreground"
}

export default function InvoicesPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("Tous les statuts")
  const [formInvoice, setFormInvoice] = useState<Invoice | undefined>()
  const [formOpen, setFormOpen] = useState(false)
  const [viewInvoice, setViewInvoice] = useState<Invoice | undefined>()
  const deferredSearch = useDeferredValue(search.trim().toLocaleLowerCase("fr"))
  const { invoices, isLoading, isError } = useInvoices()
  const { customers } = useCustomers()
  const deleteMutation = useDeleteInvoice()
  const modalOpen = formOpen || Boolean(viewInvoice)

  useEffect(() => {
    if (!modalOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setFormOpen(false)
        setFormInvoice(undefined)
        setViewInvoice(undefined)
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [modalOpen])

  function closeModal() {
    setFormOpen(false)
    setFormInvoice(undefined)
    setViewInvoice(undefined)
  }

  const visibleInvoices = (invoices as Invoice[]).filter((invoice) => {
    const matchesSearch = (invoice.numero ?? "").toLocaleLowerCase("fr").includes(deferredSearch)
    const matchesStatus = statusFilter === "Tous les statuts" || invoice.statut === statusFilter
    return matchesSearch && matchesStatus
  })

  const openCreateForm = () => {
    setFormInvoice(undefined)
    setFormOpen(true)
  }

  const deleteInvoice = (invoice: Invoice) => {
    if (window.confirm(`Supprimer la facture « ${invoice.numero} » ?`)) {
      deleteMutation.mutate(invoice.id)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground lg:grid lg:grid-cols-[250px_minmax(0,1fr)]">
      <AppSidebar active="invoices" />

      <main className="min-w-0 px-4 py-6 sm:px-6 lg:col-start-2 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-[1440px] space-y-6">
          <header className="flex flex-wrap items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                <FileText aria-hidden="true" size={26} />
              </span>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Factures</h1>
                <p className="mt-1 text-sm text-muted-foreground sm:text-base">Gérez les factures de vos clients.</p>
              </div>
            </div>
            <Button onClick={openCreateForm} className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus aria-hidden="true" size={18} /> Nouvelle facture
            </Button>
          </header>

          <section aria-label="Filtres des factures" className="grid gap-3 sm:grid-cols-[minmax(240px,400px)_minmax(220px,1fr)]">
            <label className="relative block">
              <span className="sr-only">Rechercher par numéro de facture</span>
              <Search aria-hidden="true" size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Rechercher par numéro…"
                className="h-12 border-border bg-card pl-10 text-foreground placeholder:text-muted-foreground"
              />
            </label>
            <label>
              <span className="sr-only">Filtrer par statut</span>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
                className="h-12 w-full rounded-xl border border-border bg-card px-4 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <option value="Tous les statuts">Tous les statuts</option>
                {STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
              </select>
            </label>
          </section>

          {deleteMutation.isError && (
            <p role="alert" className="rounded-xl border border-border bg-card p-4 text-sm text-destructive">
              La suppression de la facture a échoué. Veuillez réessayer.
            </p>
          )}

          <section aria-label="Liste des factures" className="overflow-hidden rounded-2xl border border-border bg-card">
            {isError ? (
              <div role="alert" className="p-8 text-center text-sm text-muted-foreground">
                Impossible de charger les factures. Vérifiez la connexion à l’API, puis actualisez la page.
              </div>
            ) : isLoading ? (
              <p className="p-8 text-center text-sm text-muted-foreground">Chargement des factures…</p>
            ) : visibleInvoices.length === 0 ? (
              <div className="flex min-h-56 flex-col items-center justify-center px-6 py-10 text-center">
                <FileText aria-hidden="true" className="text-muted-foreground" size={30} />
                <p className="mt-3 font-medium">
                  {search || statusFilter !== "Tous les statuts" ? "Aucune facture ne correspond à vos filtres." : "Aucune facture pour le moment."}
                </p>
                {!search && statusFilter === "Tous les statuts" && (
                  <Button onClick={openCreateForm} variant="outline" className="mt-4 border-border text-foreground">
                    <Plus aria-hidden="true" size={16} /> Créer une facture
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[820px] border-collapse text-left">
                  <thead className="bg-secondary/60 text-xs font-semibold uppercase tracking-wide text-secondary-foreground">
                    <tr>
                      <th scope="col" className="px-5 py-4">Numéro</th>
                      <th scope="col" className="px-5 py-4">Client</th>
                      <th scope="col" className="px-5 py-4">Montant</th>
                      <th scope="col" className="px-5 py-4">Statut</th>
                      <th scope="col" className="px-5 py-4">Date</th>
                      <th scope="col" className="px-5 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {visibleInvoices.map((invoice) => (
                      <tr key={invoice.id} className="transition-colors hover:bg-secondary/30">
                        <th scope="row" className="whitespace-nowrap px-5 py-4 font-medium">{invoice.numero || "—"}</th>
                        <td className="px-5 py-4 text-sm text-muted-foreground">{customerName(invoice, customers as Customer[])}</td>
                        <td className="whitespace-nowrap px-5 py-4 font-semibold tabular-nums">{formatAr(invoice.montant)}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${statusStyle(invoice.statut)}`}>
                            {invoice.statut}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-sm">{formatDate(invoice.dateFacture)}</td>
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              aria-label={`Voir la facture ${invoice.numero}`}
                              onClick={() => setViewInvoice(invoice)}
                              className="text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                            >
                              <Eye aria-hidden="true" size={17} />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              aria-label={`Modifier la facture ${invoice.numero}`}
                              onClick={() => { setFormInvoice(invoice); setFormOpen(true) }}
                              className="text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
                            >
                              <Pencil aria-hidden="true" size={17} />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              aria-label={`Supprimer la facture ${invoice.numero}`}
                              disabled={deleteMutation.isPending}
                              onClick={() => deleteInvoice(invoice)}
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

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[color-mix(in_srgb,var(--palette-espresso)_80%,transparent)] p-4 backdrop-blur-sm"
          onMouseDown={(event) => { if (event.target === event.currentTarget) closeModal() }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby={viewInvoice ? "invoice-view-title" : "invoice-form-title"}
            className="relative my-auto w-full max-w-xl rounded-2xl border border-border bg-background p-5 shadow-2xl sm:p-7"
          >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Fermer"
              onClick={closeModal}
              className="absolute right-4 top-4 text-muted-foreground hover:bg-secondary hover:text-secondary-foreground"
            >
              <X aria-hidden="true" size={19} />
            </Button>
            {viewInvoice ? (
              <div className="space-y-5 pr-8">
                <header className="border-b border-border pb-4">
                  <h2 id="invoice-view-title" className="text-xl font-bold tracking-tight">Détails de la facture</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{viewInvoice.numero}</p>
                </header>
                <dl className="grid grid-cols-2 gap-4 text-sm">
                  <div><dt className="text-muted-foreground">Client</dt><dd className="mt-1 font-medium">{customerName(viewInvoice, customers as Customer[])}</dd></div>
                  <div><dt className="text-muted-foreground">Montant</dt><dd className="mt-1 font-semibold">{formatAr(viewInvoice.montant)}</dd></div>
                  <div><dt className="text-muted-foreground">Statut</dt><dd className="mt-1"><span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusStyle(viewInvoice.statut)}`}>{viewInvoice.statut}</span></dd></div>
                  <div><dt className="text-muted-foreground">Date</dt><dd className="mt-1 font-medium">{formatDate(viewInvoice.dateFacture)}</dd></div>
                </dl>
                <footer className="flex justify-end border-t border-border pt-4">
                  <Button type="button" onClick={closeModal} className="bg-primary text-primary-foreground hover:bg-primary/90">Fermer</Button>
                </footer>
              </div>
            ) : (
              <InvoiceForm
                key={formInvoice?.id ?? "new-invoice"}
                invoice={formInvoice}
                onSuccess={closeModal}
                onCancel={closeModal}
              />
            )}
          </section>
        </div>
      )}
    </div>
  )
}
