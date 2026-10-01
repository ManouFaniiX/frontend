"use client"

import { useState } from "react"
import { useCreateProduct } from "@/features/products/hooks/useProducts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { ProductPayload } from "@/interfaces/product/product-types"

interface ProductFormProps {
  onSuccess?: () => void
}

export function ProductForm({ onSuccess }: ProductFormProps) {
  const createMutation = useCreateProduct()

  const [formData, setFormData] = useState<ProductPayload>({
    nom: "",
    description: "",
    prix: 0,
    stock: 0,
    categoryId: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate(formData, {
      onSuccess: () => {
        // Réinitialiser le formulaire ou fermer la modale
        setFormData({ nom: "", description: "", prix: 0, stock: 0, categoryId: "" })
        if (onSuccess) onSuccess()
      },
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-zinc-950 p-6 rounded-2xl border border-white/10 text-white">
      <h2 className="text-xl font-bold tracking-tight">Ajouter un produit</h2>
      
      <div>
        <label className="block text-sm text-zinc-400 mb-1">Nom du produit</label>
        <Input 
          type="text"
          value={formData.nom}
          onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
          required
          className="bg-black border-white/10 text-white"
          placeholder="Ex: Tôle galvanisée"
        />
      </div>

      <div>
        <label className="block text-sm text-zinc-400 mb-1">Description</label>
        <Input 
          type="text"
          value={formData.description || ""}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="bg-black border-white/10 text-white"
          placeholder="Ex: Description du produit..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Prix (Ar)</label>
          <Input 
            type="number"
            value={formData.prix}
            onChange={(e) => setFormData({ ...formData, prix: Number(e.target.value) })}
            required
            className="bg-black border-white/10 text-white"
          />
        </div>
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Stock initial</label>
          <Input 
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
            required
            className="bg-black border-white/10 text-white"
          />
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <Button 
          type="submit" 
          disabled={createMutation.isPending}
          className="bg-amber-400 text-black hover:bg-amber-500 font-semibold"
        >
          {createMutation.isPending ? "Création en cours..." : "Enregistrer le produit"}
        </Button>
      </div>
    </form>
  ) 
}

export default ProductForm  