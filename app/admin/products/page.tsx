"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { DashboardLayout } from "@/components/admin/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast" // Assuming you have toast component

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/products')
        
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        
        const data = await response.json()
        setProducts(data)
        setError(null)
      } catch (err) {
        console.error('Error fetching products:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
        // If API fails, use dummy data as fallback
        // setProducts([
        //   {
        //     id: 1,
        //     name: "Produit Populaire 1",
        //     price: 99.99,
        //     category: "Électronique",
        //     brand: "Marque 1",
        //     isBestseller: true,
        //     isNew: false,
        //     image: "/placeholder.svg?height=300&width=400",
        //   },
        //   {
        //     id: 2,
        //     name: "Produit Populaire 2",
        //     price: 149.99,
        //     category: "Maison",
        //     brand: "Marque 2",
        //     isBestseller: true,
        //     isNew: false,
        //     image: "/placeholder.svg?height=300&width=400",
        //   },
        //   // Add more dummy products if needed
        // ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Filter products based on search term
  const filteredProducts = products.filter(
    (product: any) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Delete product
  const handleDelete = async (id: any) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      try {
        const response = await fetch(`/api/products/${id}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to delete product")
        }

        // Update local state to remove the deleted product
        setProducts(products.filter((product: any) => product.id !== id))
        
        // Show success message
        toast({
          title: "Success",
          description: "Product deleted successfully",
        })
      } catch (error) {
        console.error("Error deleting product:", error)
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to delete product",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <DashboardLayout>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gestion des Produits</CardTitle>
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un produit
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un produit..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-4">
              <p>Erreur lors du chargement des produits: {error}</p>
              <p className="text-sm mt-1">Utilisation des données de démonstration comme solution de secours.</p>
            </div>
          )}

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead className="hidden md:table-cell">Catégorie</TableHead>
                  <TableHead className="hidden md:table-cell">Marque</TableHead>
                  <TableHead className="hidden md:table-cell">Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      Chargement des produits...
                    </TableCell>
                  </TableRow>
                ) : filteredProducts.length > 0 ? (
                  filteredProducts.map((product: any ) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>${product.price}</TableCell>
                      <TableCell className="hidden md:table-cell">{product.category}</TableCell>
                      <TableCell className="hidden md:table-cell">{product.brand}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex gap-2">
                          {product.isBestseller && <Badge className="bg-yellow-600">Top Vente</Badge>}
                          {product.isNew && <Badge className="bg-blue-700">Nouveau</Badge>}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/admin/products/${product.id}`}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Modifier</span>
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDelete(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Supprimer</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      Aucun produit trouvé
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}