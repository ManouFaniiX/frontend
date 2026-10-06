"use client"

import { useProducts, useDeleteProduct } from "@/features/products/hooks/useProducts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Product } from "@/interfaces/product/product-types"

export function ProductList() {
  const { products, isLoading, error } = useProducts()
  const deleteMutation = useDeleteProduct()

  if (isLoading) {
    return <div className="p-6 text-muted-foreground">Chargement des produits...</div>
  }

  if (error) {
    return <div className="p-6 text-destructive">Erreur lors du chargement des produits.</div>
  }

  return (
    <div className="space-y-4 text-foreground">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product: Product) => (
          <Card key={product.id} className="bg-card border-border text-card-foreground rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">{product.nom}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">{product.description || "Aucune description"}</p>
              <div className="flex justify-between items-center pt-4">
                <span className="text-lg font-bold text-primary">{product.prix} Ar</span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground border border-border">
                  Stock : {product.stock}
                </span>
              </div>
              <div className="pt-4 flex justify-end">
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => deleteMutation.mutate(product.id)}
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border"
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
