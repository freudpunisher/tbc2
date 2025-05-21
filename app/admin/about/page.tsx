"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Edit, Upload, X, Loader2, Plus, Trash2 } from "lucide-react"
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
} from "@/components/ui/alert-dialog"

// Define types for our content
interface AboutContent {
  id: number
  section: string
  title: string | null
  content: string | null
  imageUrl: string | null
}

// Define available sections
const SECTIONS = {
  hero: "Bannière Principale",
  story: "Notre Histoire",
  "why-choose-us": "Pourquoi Nous Choisir"
}

type SectionKey = keyof typeof SECTIONS

export default function AboutPage() {
  const [aboutContent, setAboutContent] = useState<AboutContent[]>([])
  const [editingContent, setEditingContent] = useState<AboutContent | null>(null)
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<SectionKey>("hero")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [contentToDelete, setContentToDelete] = useState<AboutContent | null>(null)

  // Fetch about content from the API
  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        const response = await fetch("/api/about")
        if (!response.ok) {
          throw new Error("Failed to fetch about content")
        }
        const data = await response.json()
        setAboutContent(data)
      } catch (error) {
        console.error("Error fetching about content:", error)
        toast({
          title: "Erreur",
          description: "Échec du chargement du contenu. Veuillez rafraîchir la page.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchAboutContent()
    setMounted(true)
  }, [])

  if (!mounted) return null

  const handleAddContent = () => {
    setEditingContent({
      id: 0, // Temporary ID, will be replaced after save
      section: activeTab,
      title: "",
      content: "",
      imageUrl: null
    })
  }

  const handleEdit = (content: AboutContent) => {
    setEditingContent({ ...content })
    // Reset image states when editing
    setImageFile(null)
    setPreviewImage(null)
  }

  const handleDelete = (content: AboutContent) => {
    setContentToDelete(content)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!contentToDelete) return
    
    try {
      const response = await fetch(`/api/about/${contentToDelete.id}`, {
        method: "DELETE"
      })
      
      if (!response.ok) {
        throw new Error("Failed to delete content")
      }
      
      // Remove the deleted content from state
      setAboutContent(aboutContent.filter(item => item.id !== contentToDelete.id))
      
      toast({
        title: "Succès",
        description: "Contenu supprimé avec succès"
      })
    } catch (error) {
      console.error("Error deleting content:", error)
      toast({
        title: "Erreur",
        description: "Échec de la suppression du contenu",
        variant: "destructive"
      })
    } finally {
      setDeleteDialogOpen(false)
      setContentToDelete(null)
    }
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

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) {
      return editingContent?.imageUrl || null // Return existing URL if no new file
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

  const handleSave = async () => {
    if (!editingContent) return
    
    setSaving(true)
    
    try {
      let finalContent = {...editingContent}
      
      if (imageFile) {
        // If we have a new image file, upload it first
        const uploadedImageUrl = await uploadImage()
        finalContent.imageUrl = uploadedImageUrl
      }

      // Determine if this is a new section or an update
      const isNewContent = !finalContent.id || finalContent.id === 0
      const method = isNewContent ? "POST" : "PUT"
      const url = isNewContent ? "/api/about" : `/api/about/${finalContent.id}`
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalContent),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to save content")
      }

      const savedContent = await response.json()
      
      // Update the content state with the saved data
      if (isNewContent) {
        setAboutContent([...aboutContent, savedContent])
      } else {
        setAboutContent(aboutContent.map((content) => 
          content.id === finalContent.id ? finalContent : content
        ))
      }

      // Show success message
      toast({
        title: "Succès",
        description: "Contenu enregistré avec succès",
      })

      // Clear editing state
      setEditingContent(null)
      setImageFile(null)
      setPreviewImage(null)
    } catch (error) {
      console.error("Error saving content:", error)
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Échec de l'enregistrement du contenu",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  // Filter content for the active tab
  const sectionContent = aboutContent.filter(content => content.section === activeTab)

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 flex items-center justify-center h-64">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-2">Chargement du contenu...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestion du Contenu À Propos</h1>
          <Button onClick={handleAddContent}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un contenu
          </Button>
        </div>

        <Tabs 
          defaultValue="hero" 
          className="space-y-6"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as SectionKey)}
        >
          <TabsList>
            {Object.entries(SECTIONS).map(([key, label]) => (
              <TabsTrigger key={key} value={key}>{label}</TabsTrigger>
            ))}
          </TabsList>

          {Object.keys(SECTIONS).map((section) => (
            <TabsContent key={section} value={section} className="space-y-4">
              {aboutContent.filter(content => content.section === section).length === 0 ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="mb-4">Aucun contenu pour {SECTIONS[section as SectionKey]}.</p>
                    <Button onClick={handleAddContent}>
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter un contenu
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                aboutContent
                  .filter(content => content.section === section)
                  .map((content) => (
                    <Card key={content.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col gap-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h2 className="text-xl font-semibold">{SECTIONS[content.section as SectionKey]}</h2>
                              <p className="text-gray-500 text-sm mt-1">
                                ID: {content.id}
                              </p>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" onClick={() => handleEdit(content)}>
                                <Edit className="h-4 w-4 mr-1" />
                                Modifier
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleDelete(content)} className="text-red-500 border-red-200 hover:bg-red-50">
                                <Trash2 className="h-4 w-4 mr-1" />
                                Supprimer
                              </Button>
                            </div>
                          </div>

                          {content.title && (
                            <div>
                              <h3 className="font-medium">Titre</h3>
                              <p className="mt-1">{content.title}</p>
                            </div>
                          )}

                          {content.content && (
                            <div>
                              <h3 className="font-medium">Contenu</h3>
                              <p className="mt-1 whitespace-pre-line">{content.content}</p>
                            </div>
                          )}

                          {content.imageUrl && (
                            <div>
                              <h3 className="font-medium mb-2">Image</h3>
                              <div className="relative aspect-video w-full max-w-md rounded-lg overflow-hidden border">
                                <Image
                                  src={content.imageUrl || "/placeholder.svg"}
                                  alt={content.title || "Image"}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Edit Modal */}
        {editingContent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">
                    {editingContent.id 
                      ? `Modifier la section ${SECTIONS[editingContent.section as SectionKey]}`
                      : `Ajouter un contenu - ${SECTIONS[editingContent.section as SectionKey]}`
                    }
                  </h2>
                  <Button variant="ghost" size="icon" onClick={() => setEditingContent(null)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Titre</Label>
                    <Input
                      id="title"
                      value={editingContent.title || ""}
                      onChange={(e) => setEditingContent({ ...editingContent, title: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="content">Contenu</Label>
                    <Textarea
                      id="content"
                      value={editingContent.content || ""}
                      onChange={(e) => setEditingContent({ ...editingContent, content: e.target.value })}
                      rows={6}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Image</Label>
                    {(previewImage || editingContent.imageUrl) ? (
                      <div className="mt-1 relative aspect-video w-full rounded-lg overflow-hidden border">
                        <Image
                          src={previewImage || editingContent.imageUrl || "/placeholder.svg"}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="mt-1 border border-dashed rounded-lg p-8 text-center text-gray-500">
                        Aucune image
                      </div>
                    )}
                    
                    <Label
                      htmlFor="image-upload"
                      className="cursor-pointer flex items-center justify-center gap-2 w-full py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 mt-2"
                    >
                      {uploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                      <span>
                        {uploading 
                          ? "Téléchargement..." 
                          : (previewImage || editingContent.imageUrl) 
                            ? "Changer l'image" 
                            : "Ajouter une image"
                        }
                      </span>
                      <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        disabled={uploading}
                      />
                    </Label>
                    
                    {(previewImage || editingContent.imageUrl) && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-red-500 mt-2"
                        onClick={() => {
                          setPreviewImage(null)
                          setImageFile(null)
                          setEditingContent({
                            ...editingContent,
                            imageUrl: null
                          })
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Supprimer l'image
                      </Button>
                    )}
                    
                    <p className="text-sm text-gray-500 mt-2">
                      Format recommandé: JPG ou PNG.
                    </p>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <Button variant="outline" onClick={() => setEditingContent(null)} disabled={saving || uploading}>
                    Annuler
                  </Button>
                  <Button onClick={handleSave} disabled={saving || uploading}>
                    {saving || uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {editingContent.id ? "Mise à jour..." : "Création..."}
                      </>
                    ) : (editingContent.id ? "Enregistrer" : "Créer")}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce contenu ?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action est irréversible. Le contenu sera définitivement supprimé.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  )
}