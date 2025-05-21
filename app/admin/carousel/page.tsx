"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { DashboardLayout } from "@/components/admin/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2, ArrowUp, ArrowDown, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

// Define carousel image type based on your schema
type CarouselImage = {
  id: number
  title: string | null
  subtitle: string | null
  imageUrl: string
  order: number
  active: boolean
}

export default function CarouselPage() {
  const router = useRouter()
  const [carouselImages, setCarouselImages] = useState<CarouselImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [processingId, setProcessingId] = useState<number | null>(null)

  // Fetch carousel images on component mount
  useEffect(() => {
    fetchCarouselImages()
  }, [])

  const fetchCarouselImages = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/carousel")
      
      if (!response.ok) {
        throw new Error("Failed to fetch carousel images")
      }
      
      const data = await response.json()
      setCarouselImages(data)
    } catch (error) {
      console.error("Error fetching carousel images:", error)
      toast({
        title: "Error",
        description: "Échec du chargement des images. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Delete image
  const handleDelete = async (id: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette image ?")) {
      return
    }

    try {
      setProcessingId(id)
      const response = await fetch(`/api/carousel/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete carousel image")
      }

      setCarouselImages(carouselImages.filter((image) => image.id !== id))
      toast({
        title: "Succès",
        description: "Image supprimée avec succès",
      })
    } catch (error) {
      console.error("Error deleting image:", error)
      toast({
        title: "Error",
        description: "Échec de la suppression de l'image. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setProcessingId(null)
    }
  }

  // Move image up in order
  const moveUp = async (id: number) => {
    const index = carouselImages.findIndex((image) => image.id === id)
    if (index <= 0) return

    try {
      setProcessingId(id)
      // Get the current and previous images
      const currentImage = carouselImages[index]
      const previousImage = carouselImages[index - 1]

      // Swap orders
      await updateImageOrder(currentImage.id, previousImage.order)
      await updateImageOrder(previousImage.id, currentImage.order)

      // Refresh the list
      await fetchCarouselImages()
    } catch (error) {
      console.error("Error moving image up:", error)
      toast({
        title: "Error",
        description: "Échec de la mise à jour de l'ordre. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setProcessingId(null)
    }
  }

  // Move image down in order
  const moveDown = async (id: number) => {
    const index = carouselImages.findIndex((image) => image.id === id)
    if (index >= carouselImages.length - 1) return

    try {
      setProcessingId(id)
      // Get the current and next images
      const currentImage = carouselImages[index]
      const nextImage = carouselImages[index + 1]

      // Swap orders
      await updateImageOrder(currentImage.id, nextImage.order)
      await updateImageOrder(nextImage.id, currentImage.order)

      // Refresh the list
      await fetchCarouselImages()
    } catch (error) {
      console.error("Error moving image down:", error)
      toast({
        title: "Error",
        description: "Échec de la mise à jour de l'ordre. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setProcessingId(null)
    }
  }

  // Update image order
  const updateImageOrder = async (id: number, newOrder: number) => {
    const response = await fetch(`/api/carousel/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ order: newOrder }),
    })

    if (!response.ok) {
      throw new Error("Failed to update image order")
    }
  }

  // Toggle active status
  const toggleActive = async (id: number) => {
    try {
      setProcessingId(id)
      const imageToUpdate = carouselImages.find(image => image.id === id)
      if (!imageToUpdate) return

      const response = await fetch(`/api/carousel/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ active: !imageToUpdate.active }),
      })

      if (!response.ok) {
        throw new Error("Failed to update carousel image status")
      }

      setCarouselImages(carouselImages.map((image) => 
        image.id === id ? { ...image, active: !image.active } : image
      ))
      
      toast({
        title: "Succès",
        description: `Image ${!imageToUpdate.active ? 'activée' : 'désactivée'} avec succès`,
      })
    } catch (error) {
      console.error("Error toggling active status:", error)
      toast({
        title: "Error",
        description: "Échec de la mise à jour du statut. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <DashboardLayout>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gestion du Carousel</CardTitle>
          <Button asChild>
            <Link href="/admin/carousel/new">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une image
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Titre</TableHead>
                  <TableHead className="hidden md:table-cell">Sous-titre</TableHead>
                  <TableHead className="hidden md:table-cell">Ordre</TableHead>
                  <TableHead className="hidden md:table-cell">Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      <div className="flex items-center justify-center">
                        <Loader2 className="h-6 w-6 mr-2 animate-spin" />
                        Chargement...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : carouselImages.length > 0 ? (
                  carouselImages.map((image) => (
                    <TableRow key={image.id}>
                      <TableCell>
                        <div className="relative w-16 h-12 rounded overflow-hidden">
                          <Image
                            src={image.imageUrl || "/placeholder.svg"}
                            alt={image.title || "Carousel image"}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{image.title || "-"}</TableCell>
                      <TableCell className="hidden md:table-cell">{image.subtitle || "-"}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <span>{image.order}</span>
                          <div className="flex flex-col">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5"
                              onClick={() => moveUp(image.id)}
                              disabled={processingId === image.id || image.order === Math.min(...carouselImages.map(img => img.order))}
                            >
                              {processingId === image.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <ArrowUp className="h-3 w-3" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-5 w-5"
                              onClick={() => moveDown(image.id)}
                              disabled={processingId === image.id || image.order === Math.max(...carouselImages.map(img => img.order))}
                            >
                              {processingId === image.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <ArrowDown className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Button
                          variant={image.active ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleActive(image.id)}
                          disabled={processingId === image.id}
                        >
                          {processingId === image.id ? (
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          ) : null}
                          {image.active ? "Actif" : "Inactif"}
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild disabled={processingId === image.id}>
                            <Link href={`/admin/carousel/${image.id}`}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Modifier</span>
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDelete(image.id)}
                            disabled={processingId === image.id}
                          >
                            {processingId === image.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                            <span className="sr-only">Supprimer</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      Aucune image trouvée
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