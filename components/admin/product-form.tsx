"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Upload } from "lucide-react"

interface ProductFormProps {
  product?: {
    id?: number
    name: string
    price: number
    description?: string
    category: string
    brand: string
    isNew: boolean
    isBestseller: boolean
    image: string
  }
  isEditing?: boolean
}

export function ProductForm({ product, isEditing = false }: ProductFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: product?.name || "",
    price: product?.price || 0,
    description: product?.description || "",
    category: product?.category || "",
    brand: product?.brand || "",
    isNew: product?.isNew || false,
    isBestseller: product?.isBestseller || false,
    image: product?.image || "/placeholder.svg?height=300&width=400",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(product?.image || null)

  // Categories and brands (fake data)
  const categories = ["Électronique", "Vêtements", "Maison", "Alimentation"]
  const brands = ["Marque 1", "Marque 2", "Marque 3"]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, you would upload the file to a server
      // For now, we'll just create a local URL for preview
      const imageUrl = URL.createObjectURL(file)
      setPreviewImage(imageUrl)
      setFormData((prev) => ({ ...prev, image: imageUrl }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, you would send the data to your API
      console.log("Product data:", formData)

      // Redirect back to products list
      router.push("/admin/products")
    } catch (error) {
      console.error("Error saving product:", error)
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nom du produit</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={5}
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Prix</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Catégorie</Label>
                    <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                      <SelectTrigger id="category" className="mt-1">
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="brand">Marque</Label>
                    <Select value={formData.brand} onValueChange={(value) => handleSelectChange("brand", value)}>
                      <SelectTrigger id="brand" className="mt-1">
                        <SelectValue placeholder="Sélectionner une marque" />
                      </SelectTrigger>
                      <SelectContent>
                        {brands.map((brand) => (
                          <SelectItem key={brand} value={brand}>
                            {brand}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isNew"
                      checked={formData.isNew}
                      onCheckedChange={(checked) => handleCheckboxChange("isNew", checked === true)}
                    />
                    <Label htmlFor="isNew">Nouveau produit</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isBestseller"
                      checked={formData.isBestseller}
                      onCheckedChange={(checked) => handleCheckboxChange("isBestseller", checked === true)}
                    />
                    <Label htmlFor="isBestseller">Top vente</Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <Label>Image du produit</Label>
                  <div className="mt-2 flex flex-col items-center">
                    <div className="relative w-full h-48 mb-4 border rounded-md overflow-hidden">
                      {previewImage ? (
                        <Image src={previewImage || "/placeholder.svg"} alt="Preview" fill className="object-contain" />
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
                      <Upload className="h-4 w-4" />
                      <span>Télécharger une image</span>
                      <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </Label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        <Button variant="outline" type="button" onClick={() => router.push("/admin/products")}>
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Enregistrement..." : isEditing ? "Mettre à jour" : "Créer le produit"}
        </Button>
      </div>
    </form>
  )
}
