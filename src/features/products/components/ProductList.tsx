"use client"

import { useProducts, useDeleteProduct } from "@/features/products/hooks/useProducts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Product } from "@/interfaces/product/product-types"

export function ProductList() {
  const { products, isLoading, error } = useProducts()
  const deleteMutation = useDeleteProduct()

  if (isLoading) {
    return <div className="p-6 text-zinc-400">Chargement des produits...</div>
  }

  if (error) {
    return <div className="p-6 text-red-400">Erreur lors du chargement des produits.</div>
  }

  return (
    <div className="space-y-6 p-6 bg-black min-h-screen text-white">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Catalogue Produits</h1>
          <p className="text-sm text-zinc-400">Gérez vos produits, stocks et prix en un clin d'œil.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((product: Product) => (
          <Card key={product.id} className="bg-zinc-950 border-white/10 text-white rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">{product.nom}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-zinc-400">{product.description || "Aucune description"}</p>
              <div className="flex justify-between items-center pt-4">
                <span className="text-lg font-bold text-amber-300">{product.prix} Ar</span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  Stock : {product.stock}
                </span>
              </div>
              <div className="pt-4 flex justify-end">
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => deleteMutation.mutate(product.id)}
                  className="bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
                >
                  Supprimer
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default ProductList