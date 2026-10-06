"use client"

import { useMemo, useState } from "react"
import {
  ArrowRight,
  Boxes,
  LayoutDashboard,
  Package,
  Plus,
  TrendingUp,
  TriangleAlert,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { AppSidebar } from "@/components/AppSidebar"
import { ProductForm } from "@/features/products/components/ProductForm"
import { ProductList } from "@/features/products/components/ProductList"
import { useProducts } from "@/features/products/hooks/useProducts"

const LOW_STOCK_LIMIT = 10

function formatAr(value: number) {
  return `${new Intl.NumberFormat("fr-FR").format(value)} Ar`
}

export default function DashboardPage() {
  const [showForm, setShowForm] = useState(false)
  const { products, isLoading, error } = useProducts()

  const summary = useMemo(() => {
    const stockUnits = products.reduce((total, product) => total + product.stock, 0)
    const stockValue = products.reduce(
      (total, product) => total + product.prix * product.stock,
      0,
    )
    const lowStockProducts = products.filter((product) => product.stock <= LOW_STOCK_LIMIT)

    return { stockUnits, stockValue, lowStockProducts }
  }, [products])

  const stats = [
    { label: "Produits affichés", value: isLoading ? "…" : products.length, icon: Package },
    { label: "Unités en stock", value: isLoading ? "…" : summary.stockUnits, icon: Boxes },
    {
      label: `Stock faible (≤ ${LOW_STOCK_LIMIT})`,
      value: isLoading ? "…" : summary.lowStockProducts.length,
      icon: TriangleAlert,
    },
    {
      label: "Valeur au prix catalogue",
      value: isLoading ? "…" : formatAr(summary.stockValue),
      icon: TrendingUp,
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground lg:grid lg:grid-cols-[250px_minmax(0,1fr)]">
      <AppSidebar active="dashboard" />

      <main id="dashboard" className="min-w-0 px-4 py-6 sm:px-6 lg:col-start-2 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-[1440px] space-y-7">
          <header className="rounded-3xl bg-gradient-to-br from-[var(--palette-cocoa)] to-[var(--palette-espresso)] px-6 py-8 text-[var(--palette-ivory)] shadow-lg sm:px-9 sm:py-10">
            <p className="flex items-center gap-2 text-sm font-medium text-[var(--palette-stone)]">
              <LayoutDashboard aria-hidden="true" size={17} /> Tableau de bord
            </p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Bonjour 👋</h1>
            <p className="mt-2 max-w-2xl text-sm text-[var(--palette-stone)] sm:text-base">
              Voici un aperçu de votre stock et de votre catalogue produits.
            </p>
          </header>

          {error && (
            <div role="alert" className="rounded-xl border border-border bg-card p-4 text-sm text-card-foreground">
              Impossible de charger les produits. Vérifiez la connexion à l’API, puis actualisez la page.
            </div>
          )}

          <section aria-label="Indicateurs du catalogue" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map(({ label, value, icon: Icon }) => (
              <article key={label} className="flex min-h-28 items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="min-w-0">
                  <h2 className="text-sm text-muted-foreground">{label}</h2>
                  <p className="mt-2 truncate text-2xl font-bold tabular-nums" aria-live="polite">{value}</p>
                </div>
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                  <Icon aria-hidden="true" size={22} />
                </span>
              </article>
            ))}
          </section>

          <section className="grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
            <article className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
                <div>
                  <h2 className="font-semibold">Produits récents</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Les premiers produits de votre catalogue.</p>
                </div>
                <a href="#produits" className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-primary hover:underline">
                  Tout voir <ArrowRight aria-hidden="true" size={16} />
                </a>
              </div>
              {isLoading ? (
                <p className="p-6 text-sm text-muted-foreground">Chargement du catalogue…</p>
              ) : products.length === 0 ? (
                <div className="px-6 py-10 text-center">
                  <Package aria-hidden="true" className="mx-auto text-muted-foreground" size={28} />
                  <p className="mt-3 text-sm text-muted-foreground">Aucun produit à afficher pour le moment.</p>
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {products.slice(0, 5).map((product) => (
                    <li key={product.id} className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
                      <div className="min-w-0">
                        <p className="truncate font-medium">{product.nom}</p>
                        <p className="mt-1 text-sm text-muted-foreground">Stock : {product.stock}</p>
                      </div>
                      <span className="shrink-0 font-semibold tabular-nums">{formatAr(product.prix)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </article>

            <article className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="border-b border-border px-5 py-4 sm:px-6">
                <h2 className="font-semibold">Produits à réapprovisionner</h2>
                <p className="mt-1 text-sm text-muted-foreground">Seuil d’alerte : {LOW_STOCK_LIMIT} unités ou moins.</p>
              </div>
              {isLoading ? (
                <p className="p-6 text-sm text-muted-foreground">Analyse du stock…</p>
              ) : summary.lowStockProducts.length === 0 ? (
                <div className="flex min-h-40 flex-col items-center justify-center px-6 py-8 text-center">
                  <Boxes aria-hidden="true" className="text-primary" size={28} />
                  <p className="mt-3 text-sm text-muted-foreground">Tous les produits affichés ont un stock suffisant.</p>
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {summary.lowStockProducts.slice(0, 5).map((product) => (
                    <li key={product.id} className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
                      <span className="truncate font-medium">{product.nom}</span>
                      <span className="shrink-0 rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">
                        {product.stock} en stock
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          </section>

          <section id="produits" className="scroll-mt-6 rounded-2xl border border-border bg-card p-5 sm:p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Catalogue produits</h2>
                <p className="mt-1 text-sm text-muted-foreground">Consultez et gérez vos produits.</p>
              </div>
              <Button
                onClick={() => setShowForm((visible) => !visible)}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                aria-expanded={showForm}
              >
                {showForm ? <X aria-hidden="true" size={17} /> : <Plus aria-hidden="true" size={17} />}
                {showForm ? "Fermer le formulaire" : "Nouveau produit"}
              </Button>
            </div>
            {showForm && <div className="mb-6"><ProductForm onSuccess={() => setShowForm(false)} /></div>}
            <ProductList />
          </section>
        </div>
      </main>
    </div>
  )
}
