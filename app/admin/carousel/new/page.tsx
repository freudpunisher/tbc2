// Update your NewCarouselPage component to use the improved CarouselForm

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/admin/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CarouselForm } from "@/components/admin/carousel-form"
import { toast } from "@/components/ui/use-toast"

export default function NewCarouselPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true)

    try {
      // Send the data to your API
      const response = await fetch("/api/carousel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create carousel image");
      }

      toast({
        title: "Succès",
        description: "Image du carousel ajoutée avec succès",
      })

      router.push("/admin/carousel")
      router.refresh()
    } catch (error) {
      console.error("Error creating carousel image:", error)
      toast({
        title: "Erreur",
        description: error instanceof Error 
          ? error.message 
          : "Échec de l'ajout de l'image. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DashboardLayout>
      <Card>
        <CardHeader>
          <CardTitle>Ajouter une nouvelle image au carousel</CardTitle>
        </CardHeader>
        <CardContent>
          <CarouselForm 
            onSubmit={handleSubmit} 
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}