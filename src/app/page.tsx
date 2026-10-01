"use client"

import { useState } from "react"
import { ProductList } from "@/features/products/components/ProductList"
import { ProductForm } from "@/features/products/components/ProductForm"
import { Button } from "@/components/ui/button"

export default function ProductsPage() {
  const [showForm, setShowForm] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-6 pt-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Gestion des Produits</h1>
          <p className="text-sm text-zinc-400">Gérez l'inventaire et les articles de votre production.</p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)}
          className="bg-amber-400 text-black hover:bg-amber-500 font-semibold"
        >
          {showForm ? "Fermer le formulaire" : "+ Nouveau produit"}
        </Button>
      </div>

      {showForm && (
        <div className="px-6">
          <ProductForm onSuccess={() => setShowForm(false)} />
        </div>
      )}

      <ProductList />
    </div>
  )
}