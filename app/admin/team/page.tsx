"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowUp, ArrowDown, Edit, Trash2, Plus, Upload, X, Loader2 } from "lucide-react"
import { toast } from "sonner"

// Define TeamMember type
type TeamMember = {
  id: number
  name: string
  position: string
  bio: string | null
  imageUrl: string | null
  order: number
}

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  // Fetch team members on mount
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await fetch("/api/team")
        if (!response.ok) throw new Error("Failed to fetch team members")
        const data = await response.json()
        setTeamMembers(data)
      } catch (error) {
        console.error("Error fetching team members:", error)
        toast.error("Impossible de récupérer les membres de l'équipe")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTeamMembers()
    setMounted(true)
  }, [])

  useEffect(() => {
    // Set preview image when editing member changes
    if (editingMember) {
      setPreviewImage(editingMember.imageUrl)
    } else {
      setPreviewImage(null)
      setImageFile(null)
    }
  }, [editingMember])

  if (!mounted) return null

  // Change member position order (move up)
  const handleMoveUp = async (id: number) => {
    const index = teamMembers.findIndex((member) => member.id === id)
    if (index <= 0) return

    try {
      // Get the two members whose orders will be swapped
      const currentMember = teamMembers[index]
      const previousMember = teamMembers[index - 1]

      // Swap orders locally first for immediate UI feedback
      const newMembers = [...teamMembers]
      newMembers[index].order = previousMember.order
      newMembers[index - 1].order = currentMember.order
      setTeamMembers(newMembers.sort((a, b) => a.order - b.order))

      // Update order in the database for both members
      await Promise.all([
        fetch(`/api/team/${currentMember.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: previousMember.order }),
        }),
        fetch(`/api/team/${previousMember.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: currentMember.order }),
        }),
      ])
    } catch (error) {
      console.error("Error updating team member order:", error)
      toast.error("Impossible de mettre à jour l'ordre des membres")
      // Revert the local change if API call fails
      const response = await fetch("/api/team")
      if (response.ok) {
        const data = await response.json()
        setTeamMembers(data)
      }
    }
  }

  // Change member position order (move down)
  const handleMoveDown = async (id: number) => {
    const index = teamMembers.findIndex((member) => member.id === id)
    if (index >= teamMembers.length - 1) return

    try {
      // Get the two members whose orders will be swapped
      const currentMember = teamMembers[index]
      const nextMember = teamMembers[index + 1]

      // Swap orders locally first for immediate UI feedback
      const newMembers = [...teamMembers]
      newMembers[index].order = nextMember.order
      newMembers[index + 1].order = currentMember.order
      setTeamMembers(newMembers.sort((a, b) => a.order - b.order))

      // Update order in the database for both members
      await Promise.all([
        fetch(`/api/team/${currentMember.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: nextMember.order }),
        }),
        fetch(`/api/team/${nextMember.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: currentMember.order }),
        }),
      ])
    } catch (error) {
      console.error("Error updating team member order:", error)
      toast.error("Impossible de mettre à jour l'ordre des membres")
      // Revert the local change if API call fails
      const response = await fetch("/api/team")
      if (response.ok) {
        const data = await response.json()
        setTeamMembers(data)
      }
    }
  }

  // Delete a team member
  const handleDelete = async (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce membre de l'équipe ?")) {
      try {
        const response = await fetch(`/api/team/${id}`, {
          method: "DELETE",
        })

        if (!response.ok) throw new Error("Failed to delete team member")

        // Update local state after successful deletion
        setTeamMembers(teamMembers.filter((member) => member.id !== id))
        toast.success("Membre supprimé avec succès")
      } catch (error) {
        console.error("Error deleting team member:", error)
        toast.error("Impossible de supprimer le membre")
      }
    }
  }

  // Set up editing for an existing member
  const handleEdit = (member: TeamMember) => {
    setEditingMember({ ...member })
  }

  // Initialize a new team member
  const handleAddNew = () => {
    setEditingMember({
      id: 0, // Will be assigned by the database
      name: "",
      position: "",
      bio: "",
      imageUrl: "/placeholder.svg?height=200&width=200",
      order: teamMembers.length > 0 ? Math.max(...teamMembers.map((m) => m.order)) + 1 : 1,
    })
  }

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Create a local URL for preview
      const imageUrl = URL.createObjectURL(file)
      setPreviewImage(imageUrl)
      setImageFile(file)
    }
  }

  // Upload image to server
  const uploadImage = async (): Promise<string> => {
    if (!imageFile) {
      return editingMember?.imageUrl || "/placeholder.svg?height=200&width=200" // Return existing URL if no new file
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
      toast.error("Échec du téléchargement de l'image. Veuillez réessayer.")
      throw error
    } finally {
      setUploading(false)
    }
  }

  // Save a new or updated team member
  const handleSave = async () => {
    if (!editingMember) return
    
    setIsSubmitting(true)

    try {
      let finalMember = {...editingMember}
      
      if (imageFile) {
        // If we have a new image file, upload it first
        const uploadedImageUrl = await uploadImage()
        finalMember.imageUrl = uploadedImageUrl
      }

      const isNew = finalMember.id === 0

      const method = isNew ? "POST" : "PUT"
      const url = isNew ? "/api/team" : `/api/team/${finalMember.id}`

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalMember),
      })

      if (!response.ok) throw new Error(`Failed to ${isNew ? "create" : "update"} team member`)

      if (isNew) {
        // Get the newly created member with assigned ID
        const result = await response.json()
        const newMember = { ...finalMember, id: result.id }
        setTeamMembers([...teamMembers, newMember].sort((a, b) => a.order - b.order))
      } else {
        setTeamMembers(
          teamMembers
            .map((member) => (member.id === finalMember.id ? finalMember : member))
            .sort((a, b) => a.order - b.order)
        )
      }

      toast.success(`Membre ${isNew ? "ajouté" : "mis à jour"} avec succès`)
      setEditingMember(null)
      setImageFile(null)
      setPreviewImage(null)
    } catch (error) {
      console.error(`Error ${editingMember.id ? "updating" : "creating"} team member:`, error)
      toast.error(`Impossible de ${editingMember.id ? "mettre à jour" : "créer"} le membre`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestion de l'Équipe</h1>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un membre
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement des membres de l'équipe...</p>
            </div>
          </div>
        ) : teamMembers.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Aucun membre d'équipe trouvé</p>
            <Button onClick={handleAddNew} className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter votre premier membre
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {teamMembers.map((member) => (
              <Card key={member.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/4">
                      <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden">
                        <Image
                          src={member.imageUrl || "/placeholder.svg"}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>

                    <div className="md:w-3/4 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{member.name}</h3>
                        <p className="text-yellow-600 font-medium">{member.position}</p>
                        <p className="text-gray-600 mt-2">{member.bio}</p>
                        <div className="flex items-center mt-2">
                          <span className="text-sm text-gray-500">Position: {member.order}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMoveUp(member.id)}
                          disabled={member.order === Math.min(...teamMembers.map((m) => m.order))}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMoveDown(member.id)}
                          disabled={member.order === Math.max(...teamMembers.map((m) => m.order))}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEdit(member)}>
                          <Edit className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(member.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Edit Modal */}
        {editingMember && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">
                    {editingMember.id !== 0 ? "Modifier le membre" : "Ajouter un nouveau membre"}
                  </h2>
                  <Button variant="ghost" size="icon" onClick={() => setEditingMember(null)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nom</Label>
                    <Input
                      id="name"
                      value={editingMember.name}
                      onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="position">Poste</Label>
                    <Input
                      id="position"
                      value={editingMember.position}
                      onChange={(e) => setEditingMember({ ...editingMember, position: e.target.value })}
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="bio">Biographie</Label>
                    <Textarea
                      id="bio"
                      value={editingMember.bio || ""}
                      onChange={(e) => setEditingMember({ ...editingMember, bio: e.target.value })}
                      rows={4}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label>Photo</Label>
                    <div className="mt-2 flex flex-col items-center">
                      <div className="relative w-40 h-40 mb-4 rounded-full overflow-hidden border">
                        {previewImage ? (
                          <Image src={previewImage} alt="Preview" fill className="object-cover" />
                        ) : (
                          <div className="flex items-center justify-center h-full bg-gray-100 text-gray-400">
                            Aucune photo
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
                        <span>{uploading ? "Téléchargement..." : "Télécharger une photo"}</span>
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
                        Format recommandé: photo carrée, minimum 200x200 pixels.
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="order">Position</Label>
                    <Input
                      id="order"
                      type="number"
                      min="1"
                      value={editingMember.order}
                      onChange={(e) => setEditingMember({ ...editingMember, order: Number.parseInt(e.target.value) })}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <Button variant="outline" onClick={() => setEditingMember(null)} disabled={isSubmitting || uploading}>
                    Annuler
                  </Button>
                  <Button onClick={handleSave} disabled={isSubmitting || uploading}>
                    {isSubmitting || uploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {uploading ? "Téléchargement..." : "Enregistrement..."}
                      </>
                    ) : (
                      "Enregistrer"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}