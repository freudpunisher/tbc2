// Update your CarouselForm component to use the upload API

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface CarouselFormProps {
  image?: {
    id?: number
    title: string | null
    subtitle: string | null
    imageUrl: string
    order: number
    active: boolean
  }
  isEditing?: boolean
  onSubmit?: (formData: any) => Promise<void>
  isSubmitting?: boolean
}

export function CarouselForm({ 
  image, 
  isEditing = false, 
  onSubmit,
  isSubmitting = false
}: CarouselFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: image?.title || "",
    subtitle: image?.subtitle || "",
    imageUrl: image?.imageUrl || "/placeholder.svg?height=600&width=1200",
    order: image?.order || 1,
    active: image?.active ?? true,
  })
  const [previewImage, setPreviewImage] = useState<string | null>(image?.imageUrl || null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, active: checked }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Create a local URL for preview
      const imageUrl = URL.createObjectURL(file)
      setPreviewImage(imageUrl)
      setImageFile(file)
    }
  }

  const uploadImage = async (): Promise<string> => {
    if (!imageFile) {
      return formData.imageUrl // Return existing URL if no new file
    }
    
    setUploading(true)
    
    try {
      // Create a FormData object to send the file
      const formData = new FormData()
      formData.append('file', imageFile)
      
      // Upload the file to our API endpoint
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error('Upload failed')
      }
      
      const data = await response.json()
      return data.fileUrl // Use the URL returned by the API
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Erreur",
        description: "Échec du téléchargement de l'image. Veuillez réessayer.",
        variant: "destructive",
      })
      throw error
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      let finalFormData = {...formData}
      
      if (imageFile) {
        // If we have a new image file, upload it first
        const uploadedImageUrl = await uploadImage()
        finalFormData.imageUrl = uploadedImageUrl
      }

      // Call the provided onSubmit function with our form data
      if (onSubmit) {
        await onSubmit(finalFormData)
      } else {
        // Fallback behavior if no onSubmit was provided
        console.log("Carousel image data:", finalFormData)
        router.push("/admin/carousel")
      }
    } catch (error) {
      console.error("Error saving carousel image:", error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title || ""}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="subtitle">Sous-titre</Label>
                <Input
                  id="subtitle"
                  name="subtitle"
                  value={formData.subtitle || ""}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="order">Ordre</Label>
                  <Input
                    id="order"
                    name="order"
                    type="number"
                    min="1"
                    value={formData.order}
                    onChange={handleChange}
                    required
                    className="mt-1"
                  />
                </div>

                <div className="flex items-center space-x-2 md:mt-8">
                  <Checkbox
                    id="active"
                    checked={formData.active}
                    onCheckedChange={(checked) => handleCheckboxChange(checked === true)}
                  />
                  <Label htmlFor="active">Actif</Label>
                </div>
              </div>

              <div>
                <Label>Image du carousel</Label>
                <div className="mt-2 flex flex-col items-center">
                  <div className="relative w-full h-48 md:h-64 mb-4 border rounded-md overflow-hidden">
                    {previewImage ? (
                      <Image src={previewImage} alt="Preview" fill className="object-cover" />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-gray-100 text-gray-400">
                        Aucune image
                      </div>
                    )}
                  </div>

                  <Label
                    htmlFor="image-upload"
                    className="cursor-pointer flex items-center justify-center gap-2 w-full py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    {uploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    <span>{uploading ? "Téléchargement..." : "Télécharger une image"}</span>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      disabled={uploading}
                    />
                  </Label>
                  <p className="text-sm text-gray-500 mt-2">
                    Format recommandé: 1920x600 pixels. JPG ou PNG.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Button variant="outline" type="button" onClick={() => router.push("/admin/carousel")}>
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting || uploading}>
          {isSubmitting || uploading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {isEditing ? "Mise à jour..." : "Création..."}
            </>
          ) : (
            isEditing ? "Mettre à jour" : "Créer l'image"
          )}
        </Button>
      </div>
    </form>
  )
}