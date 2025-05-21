"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/admin/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CarouselForm } from "@/components/admin/carousel-form"
import { toast } from "@/components/ui/use-toast"

type CarouselImage = {
  id: number
  title: string | null
  subtitle: string | null
  imageUrl: string
  order: number
  active: boolean
}

export default function EditCarouselPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [carouselImage, setCarouselImage] = useState<CarouselImage | null>(null)

  useEffect(() => {
    const fetchCarouselImage = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/carousel/${params.id}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            toast({
              title: "Erreur",
              description: "Image non trouvée",
              variant: "destructive",
            })
            router.push("/admin/carousel")
            return
          }
          throw new Error("Failed to fetch carousel image")
        }
        
        const data = await response.json()
        setCarouselImage(data)
      } catch (error) {
        console.error("Error fetching carousel image:", error)
        toast({
          title: "Erreur",
          description: "Échec du chargement de l'image. Veuillez réessayer.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCarouselImage()
  }, [params.id, router])

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/carousel/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to update carousel image")
      }

      toast({
        title: "Succès",
        description: "Image du carousel mise à jour avec succès",
      })

      router.push("/admin/carousel")
      router.refresh()
    } catch (error) {
      console.error("Error updating carousel image:", error)
      toast({
        title: "Erreur",
        description: "Échec de la mise à jour de l'image. Veuillez réessayer.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <Card>
          <CardHeader>
            <CardTitle>Chargement...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center py-8">
              <div className="animate-pulse">Chargement des données...</div>
            </div>
          </CardContent>
        </Card>
      </DashboardLayout>
    )
  }

  if (!carouselImage) {
    return (
      <DashboardLayout>
        <Card>
          <CardHeader>
            <CardTitle>Erreur</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-red-500">
              Impossible de charger les données de l'image
            </div>
          </CardContent>
        </Card>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <Card>
        <CardHeader>
          <CardTitle>Modifier l'image du carousel</CardTitle>
        </CardHeader>
        <CardContent>
          <CarouselForm 
            image={carouselImage} 
            isEditing={true} 
            onSubmit={handleSubmit} 
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}




