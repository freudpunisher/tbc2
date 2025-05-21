"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, Eye, MapPin, Loader2 } from "lucide-react"
import Link from "next/link"
import { toast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Define the shop type
type Shop = {
  id: number
  name: string
  slug: string
  address: string
  active: boolean
  location: string
}

export default function ShopsAdminPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("local")
  const [shops, setShops] = useState<Shop[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null)
  const [statusLoading, setStatusLoading] = useState<number | null>(null)

  // Fetch shops from API
  const fetchShops = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/shops")
      if (!response.ok) {
        throw new Error("Failed to fetch shops")
      }
      const data = await response.json()
      setShops(data)
    } catch (error) {
      console.error("Error fetching shops:", error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les boutiques. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Delete shop
  const handleDelete = async (id: number) => {
    try {
      setDeleteLoading(id)
      const response = await fetch(`/api/shops/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete shop")
      }

      // Remove the shop from the state
      setShops(shops.filter((shop) => shop.id !== id))

      toast({
        title: "Succès",
        description: "La boutique a été supprimée avec succès.",
      })
    } catch (error) {
      console.error("Error deleting shop:", error)
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la boutique. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setDeleteLoading(null)
    }
  }

  // Toggle shop active status
  const handleToggleActive = async (id: number, currentActive: boolean) => {
    try {
      setStatusLoading(id)
      const response = await fetch(`/api/shops/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ active: !currentActive }),
      })

      if (!response.ok) {
        throw new Error("Failed to update shop status")
      }

      // Update the shop in the state
      setShops(shops.map((shop) => (shop.id === id ? { ...shop, active: !currentActive } : shop)))

      toast({
        title: "Succès",
        description: `La boutique est maintenant ${!currentActive ? "active" : "inactive"}.`,
      })
    } catch (error) {
      console.error("Error updating shop status:", error)
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la boutique. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setStatusLoading(null)
    }
  }

  // Load shops on component mount
  useEffect(() => {
    fetchShops()
  }, [])

  // Filter shops based on active tab
  const localShops = shops.filter((shop) => shop.location === "local")
  const internationalShops = shops.filter((shop) => shop.location === "international")

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestion des Boutiques</h1>
          <Button onClick={() => router.push("/admin/espaces/new")}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une boutique
          </Button>
        </div>

        <Tabs defaultValue="local" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="local">Boutiques Locales</TabsTrigger>
            <TabsTrigger value="international">Boutiques Internationales</TabsTrigger>
          </TabsList>

          <TabsContent value="local">
            <Card>
              <CardHeader>
                <CardTitle>Boutiques au Burundi</CardTitle>
                <CardDescription>
                  Gérez vos boutiques locales. Vous pouvez ajouter, modifier ou supprimer des boutiques.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : localShops.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Aucune boutique locale trouvée. Cliquez sur "Ajouter une boutique" pour commencer.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Adresse</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {localShops.map((shop) => (
                        <TableRow key={shop.id}>
                          <TableCell className="font-medium">{shop.name}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              {shop.address}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={shop.active ? "default" : "secondary"}
                              className={shop.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                            >
                              {shop.active ? "Actif" : "Inactif"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleToggleActive(shop.id, shop.active)}
                                disabled={statusLoading === shop.id}
                              >
                                {statusLoading === shop.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : shop.active ? (
                                  "Désactiver"
                                ) : (
                                  "Activer"
                                )}
                              </Button>
                              <Button variant="outline" size="icon" asChild>
                                <Link href={`/espaces/${shop.slug}`} target="_blank">
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">Voir</span>
                                </Link>
                              </Button>
                              <Button variant="outline" size="icon" asChild>
                                <Link href={`/admin/espaces/${shop.id}`}>
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Modifier</span>
                                </Link>
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="icon" className="text-red-500">
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Supprimer</span>
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Êtes-vous sûr?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Cette action ne peut pas être annulée. Cela supprimera définitivement la boutique
                                      "{shop.name}" et toutes les données associées.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(shop.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                      disabled={deleteLoading === shop.id}
                                    >
                                      {deleteLoading === shop.id ? (
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                      ) : null}
                                      Supprimer
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="international">
            <Card>
              <CardHeader>
                <CardTitle>Boutiques Internationales</CardTitle>
                <CardDescription>
                  Gérez vos boutiques à l'international. Vous pouvez ajouter, modifier ou supprimer des boutiques.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  </div>
                ) : internationalShops.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Aucune boutique internationale trouvée. Cliquez sur "Ajouter une boutique" pour commencer.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nom</TableHead>
                        <TableHead>Adresse</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {internationalShops.map((shop) => (
                        <TableRow key={shop.id}>
                          <TableCell className="font-medium">{shop.name}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4 text-gray-500" />
                              {shop.address}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={shop.active ? "default" : "secondary"}
                              className={shop.active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                            >
                              {shop.active ? "Actif" : "Inactif"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleToggleActive(shop.id, shop.active)}
                                disabled={statusLoading === shop.id}
                              >
                                {statusLoading === shop.id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : shop.active ? (
                                  "Désactiver"
                                ) : (
                                  "Activer"
                                )}
                              </Button>
                              <Button variant="outline" size="icon" asChild>
                                <Link href={`/espaces/${shop.slug}`} target="_blank">
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">Voir</span>
                                </Link>
                              </Button>
                              <Button variant="outline" size="icon" asChild>
                                <Link href={`/admin/espaces/${shop.id}`}>
                                  <Edit className="h-4 w-4" />
                                  <span className="sr-only">Modifier</span>
                                </Link>
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="icon" className="text-red-500">
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Supprimer</span>
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Êtes-vous sûr?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Cette action ne peut pas être annulée. Cela supprimera définitivement la boutique
                                      "{shop.name}" et toutes les données associées.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(shop.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                      disabled={deleteLoading === shop.id}
                                    >
                                      {deleteLoading === shop.id ? (
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                      ) : null}
                                      Supprimer
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
