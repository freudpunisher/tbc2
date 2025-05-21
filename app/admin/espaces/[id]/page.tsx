"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, Save, ArrowLeft, Upload, Edit, Trash2, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

// Define the shop type
type StaffMember = {
  id: number
  name: string
  position: string
  imagePath: string
  shopId: number
}

type Shop = {
  id?: number
  name: string
  slug: string
  address: string
  description: string
  longDescription: string
  images: string[]
  hours: string
  phone: string
  email: string
  features: string[]
  location: string
  active: boolean
  staff: StaffMember[]
}

// Common features for shops
const commonFeatures = [
  "Paiement par carte",
  "Service d'emballage cadeau",
  "Livraison à domicile",
  "Garantie produits",
  "Service après-vente",
  "Commandes spéciales",
  "Grand parking",
  "Zone de test produits",
  "Produits exclusifs",
  "Espace VIP",
  "Produits locaux",
  "Vue sur le lac",
  "Terrasse extérieure",
  "Café sur place",
  "Produits premium",
  "Service de conciergerie",
  "Livraison express",
  "Parking sécurisé",
  "Service d'emballage luxe",
  "Espace événementiel",
  "Produits artisanaux",
  "Zone de démonstration",
  "Service client multilingue",
  "Espace enfants",
]

// Empty shop template
const emptyShop: Shop = {
  name: "",
  slug: "",
  address: "",
  description: "",
  longDescription: "",
  images: [],
  hours: "Lun-Sam: 8h-19h, Dim: 9h-15h",
  phone: "",
  email: "",
  features: [],
  location: "local",
  active: true,
  staff: [],
}

export default function ShopEditPage({ params }: { params: { id: string } | Promise<{ id: string }> }) {
  // Unwrap params if it's a Promise
  const unwrappedParams = params instanceof Promise ? use(params) : params
  const { id } = unwrappedParams

  const router = useRouter()
  const isNew = id === "new"
  const [shop, setShop] = useState<Shop>(emptyShop)
  const [activeTab, setActiveTab] = useState("general")
  const [newFeature, setNewFeature] = useState("")
  const [selectedFeature, setSelectedFeature] = useState("")
  const [newStaffMember, setNewStaffMember] = useState({
    name: "",
    position: "",
    imagePath: "",
  })
  const [editingStaffId, setEditingStaffId] = useState<number | null>(null)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)

  // Fetch shop data if editing an existing shop
  useEffect(() => {
    const fetchShop = async () => {
      if (isNew) return

      try {
        setLoading(true)
        const response = await fetch(`/api/shops/${id}`)

        if (!response.ok) {
          if (response.status === 404) {
            toast({
              title: "Erreur",
              description: "Boutique non trouvée.",
              variant: "destructive",
            })
            router.push("/admin/espaces")
            return
          }
          throw new Error("Failed to fetch shop")
        }

        const data = await response.json()
        setShop(data)
      } catch (error) {
        console.error("Error fetching shop:", error)
        toast({
          title: "Erreur",
          description: "Impossible de charger les détails de la boutique. Veuillez réessayer.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchShop()
  }, [isNew, id, router])

  const handleSave = async () => {
    try {
      setSaving(true)

      // Validate required fields
      if (!shop.name || !shop.slug || !shop.address) {
        toast({
          title: "Erreur",
          description: "Veuillez remplir tous les champs obligatoires (nom, slug, adresse).",
          variant: "destructive",
        })
        setSaving(false)
        return
      }

      // Create or update shop
      const url = isNew ? "/api/shops" : `/api/shops/${id}`
      const method = isNew ? "POST" : "PUT"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(shop),
      })

      if (!response.ok) {
        throw new Error(`Failed to ${isNew ? "create" : "update"} shop`)
      }

      const savedShop = await response.json()

      toast({
        title: "Succès",
        description: `La boutique a été ${isNew ? "créée" : "mise à jour"} avec succès.`,
      })

      // Redirect to edit page if new, or shops list if updating
      if (isNew) {
        // Redirect to the edit page of the newly created shop
        router.push(`/admin/espaces/${savedShop.id}`)
      } else {
        // Redirect to shops list
        router.push("/admin/espaces")
      }
    } catch (error) {
      console.error(`Error ${isNew ? "creating" : "updating"} shop:`, error)
      toast({
        title: "Erreur",
        description: `Impossible de ${isNew ? "créer" : "mettre à jour"} la boutique. Veuillez réessayer.`,
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleAddFeature = () => {
    if (selectedFeature && !shop.features.includes(selectedFeature)) {
      setShop({
        ...shop,
        features: [...shop.features, selectedFeature],
      })
      setSelectedFeature("")
    } else if (newFeature && !shop.features.includes(newFeature)) {
      setShop({
        ...shop,
        features: [...shop.features, newFeature],
      })
      setNewFeature("")
    }
  }

  const handleRemoveFeature = (feature: string) => {
    setShop({
      ...shop,
      features: shop.features.filter((f) => f !== feature),
    })
  }

  const handleAddStaffMember = () => {
    if (newStaffMember.name && newStaffMember.position) {
      if (editingStaffId !== null) {
        // Update existing staff member
        setShop({
          ...shop,
          staff: shop.staff.map((staff) => (staff.id === editingStaffId ? { ...staff, ...newStaffMember } : staff)),
        })
        setEditingStaffId(null)
      } else {
        // Add new staff member
        setShop({
          ...shop,
          staff: [
            ...shop.staff,
            {
              id: Date.now(), // Temporary ID for UI purposes
              shopId: shop.id || 0,
              ...newStaffMember,
            },
          ],
        })
      }
      setNewStaffMember({
        name: "",
        position: "",
        imagePath: "",
      })
    }
  }

  const handleEditStaffMember = (staffId: number) => {
    const staffMember = shop.staff.find((s) => s.id === staffId)
    if (staffMember) {
      setNewStaffMember({
        name: staffMember.name,
        position: staffMember.position,
        imagePath: staffMember.imagePath,
      })
      setEditingStaffId(staffId)
    }
  }

  const handleRemoveStaffMember = (staffId: number) => {
    setShop({
      ...shop,
      staff: shop.staff.filter((staff) => staff.id !== staffId),
    })
  }

  const handleCancelStaffEdit = () => {
    setNewStaffMember({
      name: "",
      position: "",
      imagePath: "",
    })
    setEditingStaffId(null)
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "")
  }

  // Show loading state
  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">Chargement des détails de la boutique...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Button variant="outline" className="mr-4" onClick={() => router.push("/admin/espaces")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <h1 className="text-2xl font-bold">{isNew ? "Ajouter une boutique" : "Modifier la boutique"}</h1>
        </div>

        <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="general">Informations générales</TabsTrigger>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="features">Services</TabsTrigger>
            <TabsTrigger value="staff">Personnel</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Informations générales</CardTitle>
                <CardDescription>
                  Informations de base sur la boutique comme le nom, l'adresse et les coordonnées.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom de la boutique</Label>
                    <Input
                      id="name"
                      value={shop.name}
                      onChange={(e) => {
                        const newName = e.target.value
                        setShop({
                          ...shop,
                          name: newName,
                          slug: isNew ? generateSlug(newName) : shop.slug,
                        })
                      }}
                      placeholder="Nom de la boutique"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug (URL)</Label>
                    <Input
                      id="slug"
                      value={shop.slug}
                      onChange={(e) => setShop({ ...shop, slug: e.target.value })}
                      placeholder="slug-de-la-boutique"
                    />
                    <p className="text-xs text-gray-500">Utilisé dans l'URL: /espaces/{shop.slug || "slug-exemple"}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Input
                    id="address"
                    value={shop.address}
                    onChange={(e) => setShop({ ...shop, address: e.target.value })}
                    placeholder="Adresse complète"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      value={shop.phone}
                      onChange={(e) => setShop({ ...shop, phone: e.target.value })}
                      placeholder="+257 XX XXX XXX"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={shop.email}
                      onChange={(e) => setShop({ ...shop, email: e.target.value })}
                      placeholder="boutique@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="hours">Horaires</Label>
                    <Input
                      id="hours"
                      value={shop.hours}
                      onChange={(e) => setShop({ ...shop, hours: e.target.value })}
                      placeholder="Lun-Sam: 8h-19h, Dim: 9h-15h"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Emplacement</Label>
                    <Select value={shop.location} onValueChange={(value) => setShop({ ...shop, location: value })}>
                      <SelectTrigger id="location">
                        <SelectValue placeholder="Sélectionnez un emplacement" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="local">Local (Burundi)</SelectItem>
                        <SelectItem value="international">International</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="active">Statut</Label>
                    <Select
                      value={shop.active ? "active" : "inactive"}
                      onValueChange={(value) => setShop({ ...shop, active: value === "active" })}
                    >
                      <SelectTrigger id="active">
                        <SelectValue placeholder="Sélectionnez un statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Actif</SelectItem>
                        <SelectItem value="inactive">Inactif</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="description">
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
                <CardDescription>
                  Description courte et longue de la boutique qui sera affichée sur le site.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Description courte</Label>
                  <Textarea
                    id="description"
                    value={shop.description}
                    onChange={(e) => setShop({ ...shop, description: e.target.value })}
                    placeholder="Brève description de la boutique (affichée dans les listes)"
                    rows={3}
                  />
                  <p className="text-xs text-gray-500">
                    Cette description courte apparaît dans la liste des boutiques.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longDescription">Description détaillée</Label>
                  <Textarea
                    id="longDescription"
                    value={shop.longDescription}
                    onChange={(e) => setShop({ ...shop, longDescription: e.target.value })}
                    placeholder="Description détaillée de la boutique (affichée sur la page de détail)"
                    rows={8}
                  />
                  <p className="text-xs text-gray-500">
                    Cette description détaillée apparaît sur la page de la boutique.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="images">
            <Card>
              <CardHeader>
                <CardTitle>Images</CardTitle>
                <CardDescription>Ajoutez des images de la boutique qui seront affichées sur le site.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Button variant="outline" className="w-full h-24 border-dashed">
                    <Upload className="mr-2 h-5 w-5" />
                    Cliquez pour ajouter des images
                  </Button>
                  <p className="text-xs text-gray-500 mt-2">Formats acceptés: JPG, PNG, WebP. Taille maximale: 5MB.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  {shop.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="relative h-48 rounded-md overflow-hidden">
                        <img
                          src={image || "/placeholder.svg"}
                          alt={`Boutique ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                          setShop({
                            ...shop,
                            images: shop.images.filter((_, i) => i !== index),
                          })
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features">
            <Card>
              <CardHeader>
                <CardTitle>Services</CardTitle>
                <CardDescription>
                  Ajoutez les services et caractéristiques disponibles dans cette boutique.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-6">
                  {shop.features.map((feature) => (
                    <div key={feature} className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm">
                      <span>{feature}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 ml-1"
                        onClick={() => handleRemoveFeature(feature)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="feature-select">Ajouter un service prédéfini</Label>
                    <div className="flex gap-2">
                      <Select value={selectedFeature} onValueChange={setSelectedFeature}>
                        <SelectTrigger id="feature-select" className="flex-1">
                          <SelectValue placeholder="Sélectionnez un service" />
                        </SelectTrigger>
                        <SelectContent>
                          {commonFeatures
                            .filter((feature) => !shop.features.includes(feature))
                            .map((feature) => (
                              <SelectItem key={feature} value={feature}>
                                {feature}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <Button onClick={handleAddFeature} disabled={!selectedFeature}>
                        Ajouter
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-feature">Ou ajouter un service personnalisé</Label>
                    <div className="flex gap-2">
                      <Input
                        id="new-feature"
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        placeholder="Nouveau service"
                        className="flex-1"
                      />
                      <Button onClick={handleAddFeature} disabled={!newFeature}>
                        Ajouter
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staff">
            <Card>
              <CardHeader>
                <CardTitle>Personnel</CardTitle>
                <CardDescription>
                  Ajoutez les membres du personnel de la boutique qui seront affichés sur le site.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {shop.staff.map((staffMember) => (
                      <Card key={staffMember.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                              {staffMember.imagePath && (
                                <img
                                  src={staffMember.imagePath || "/placeholder.svg"}
                                  alt={staffMember.name}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium">{staffMember.name}</h3>
                              <p className="text-sm text-gray-500">{staffMember.position}</p>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleEditStaffMember(staffMember.id)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="text-red-500"
                                onClick={() => handleRemoveStaffMember(staffMember.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>{editingStaffId !== null ? "Modifier un membre" : "Ajouter un membre"}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="staff-name">Nom</Label>
                          <Input
                            id="staff-name"
                            value={newStaffMember.name}
                            onChange={(e) => setNewStaffMember({ ...newStaffMember, name: e.target.value })}
                            placeholder="Nom complet"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="staff-position">Poste</Label>
                          <Input
                            id="staff-position"
                            value={newStaffMember.position}
                            onChange={(e) => setNewStaffMember({ ...newStaffMember, position: e.target.value })}
                            placeholder="Ex: Responsable de boutique"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="staff-image">Photo</Label>
                        <div className="flex gap-2">
                          <Input
                            id="staff-image"
                            value={newStaffMember.imagePath}
                            onChange={(e) => setNewStaffMember({ ...newStaffMember, imagePath: e.target.value })}
                            placeholder="Chemin de l'image"
                            className="flex-1"
                          />
                          <Button variant="outline">
                            <Upload className="mr-2 h-4 w-4" />
                            Parcourir
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      {editingStaffId !== null && (
                        <Button variant="outline" onClick={handleCancelStaffEdit}>
                          Annuler
                        </Button>
                      )}
                      <Button onClick={handleAddStaffMember} className={editingStaffId !== null ? "" : "ml-auto"}>
                        {editingStaffId !== null ? "Mettre à jour" : "Ajouter"}
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end gap-4">
          <Button variant="outline" onClick={() => router.push("/admin/espaces")}>
            Annuler
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </>
            )}
          </Button>
        </div>
      </div>
    </AdminLayout>
  )
}
