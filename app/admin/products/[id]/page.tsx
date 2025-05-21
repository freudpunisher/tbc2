"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/admin/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, Loader2 } from "lucide-react"
import Image from "next/image"
import { toast } from "@/components/ui/use-toast"

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    description: "",
    category: "",
    brand: "",
    isNew: false,
    isBestseller: false,
    image: "/placeholder.svg?height=300&width=400",
  })
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  // Categories and brands (fake data)
  const categories = ["Électronique", "Vêtements", "Maison", "Alimentation"]
  const brands = ["Marque 1", "Marque 2", "Marque 3"]

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products?id=${productId}`)
        
        if (!response.ok) {
          throw new Error("Failed to fetch product")
        }
        
        const data = await response.json()
        if (data.length > 0) {
          const product = data[0]
          setFormData(product)
          setPreviewImage(product.image)
        } else {
          toast({
            title: "Error",
            description: "Product not found",
            variant: "destructive",
          })
          router.push("/admin/products")
        }
      } catch (error) {
        console.error("Error fetching product:", error)
        toast({
          title: "Error",
          description: "Failed to load product data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (productId) {
      fetchProduct()
    }
  }, [productId, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }))
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
      // Create a local URL for preview
      const imageUrl = URL.createObjectURL(file)
      setPreviewImage(imageUrl)
      setImageFile(file)
    }
  }

  const uploadImage = async (): Promise<string> => {
    if (!imageFile) {
      return formData.image // Return existing URL if no new file
    }
    
    setUploading(true)
    
    try {
      // Create a FormData object to send the file
      const formDataObj = new FormData()
      formDataObj.append('file', imageFile)
      
      // Upload the file to our API endpoint
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataObj,
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
    setIsSubmitting(true)
  
    try {
      let finalFormData = {...formData}
      
      if (imageFile) {
        // If we have a new image file, upload it first
        const uploadedImageUrl = await uploadImage()
        finalFormData.image = uploadedImageUrl
      }
      
      // Pick only the fields your schema expects:
      const payload = {
        name:        finalFormData.name,
        price:       finalFormData.price,
        description: finalFormData.description,
        category:    finalFormData.category,
        brand:       finalFormData.brand,
        isNew:       finalFormData.isNew,
        isBestseller: finalFormData.isBestseller,
        image:       finalFormData.image,
      }
      
      console.log(JSON.stringify(payload, null, 2), Object.entries(payload).map(([k, v]) => [k, typeof v]))
  
      const response = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
  
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update product")
      }
  
      toast({ title: "Success", description: "Product updated successfully" })
      router.push("/admin/products")
    } catch (error) {
      console.error("Error updating product:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update product",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  

  if (isLoading) {
    return (
      <DashboardLayout>
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-center items-center h-64">
              <p>Chargement des données...</p>
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
          <CardTitle>Modifier le produit</CardTitle>
        </CardHeader>
        <CardContent>
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
                          value={formData.description || ""}
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
                            onChange={handleNumberChange}
                            required
                            className="mt-1"
                          />
                        </div>

                        <div>
                          <Label htmlFor="category">Catégorie</Label>
                          <Select 
                            value={formData.category} 
                            onValueChange={(value) => handleSelectChange("category", value)}
                          >
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
                          <Select 
                            value={formData.brand} 
                            onValueChange={(value) => handleSelectChange("brand", value)}
                          >
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
                              <Image 
                                src={previewImage} 
                                alt="Preview" 
                                fill 
                                className="object-contain" 
                              />
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
                            Format recommandé: JPG ou PNG.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <Button 
                variant="outline" 
                type="button" 
                onClick={() => router.push("/admin/products")}
                disabled={isSubmitting || uploading}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting || uploading}>
                {isSubmitting || uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enregistrement...
                  </>
                ) : "Mettre à jour"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}