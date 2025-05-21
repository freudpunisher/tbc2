"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowUp, ArrowDown, Edit, Trash2, Plus, X, Loader2 } from "lucide-react"
import { toast } from "sonner"

// Type definition for milestone
interface Milestone {
  id: number
  year: string
  title: string
  description: string | null
  order: number
}

export default function MilestonesPage() {
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null)
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetchMilestones()
  }, [])

  const fetchMilestones = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/milestones")
      if (!response.ok) throw new Error("Failed to fetch milestones")
      const data = await response.json()
      setMilestones(data)
    } catch (error) {
      console.error("Error fetching milestones:", error)
      toast.error("Impossible de charger les jalons. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  const createMilestone = async (milestone: Omit<Milestone, "id">) => {
    try {
      const response = await fetch("/api/milestones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(milestone),
      })
      if (!response.ok) throw new Error("Failed to create milestone")
      const data = await response.json()
      return data.id
    } catch (error) {
      console.error("Error creating milestone:", error)
      throw error
    }
  }

  const updateMilestone = async (milestone: Milestone) => {
    try {
      const response = await fetch(`/api/milestones/${milestone.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(milestone),
      })
      if (!response.ok) throw new Error("Failed to update milestone")
    } catch (error) {
      console.error("Error updating milestone:", error)
      throw error
    }
  }

  const deleteMilestoneFromDb = async (id: number) => {
    try {
      const response = await fetch(`/api/milestones/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete milestone")
    } catch (error) {
      console.error("Error deleting milestone:", error)
      throw error
    }
  }

  const updateMilestoneOrder = async (id: number, newOrder: number) => {
    try {
      const response = await fetch(`/api/milestones/${id}/reorder`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: newOrder }),
      })
      if (!response.ok) throw new Error("Failed to update milestone order")
    } catch (error) {
      console.error("Error updating milestone order:", error)
      throw error
    }
  }

  if (!mounted) return null

  const handleMoveUp = async (id: number) => {
    const index = milestones.findIndex((milestone) => milestone.id === id)
    if (index <= 0) return

    try {
      // Get the two milestones that need their order swapped
      const currentMilestone = milestones[index]
      const previousMilestone = milestones[index - 1]
      
      // Update in DB
      await updateMilestoneOrder(currentMilestone.id, previousMilestone.order)
      await updateMilestoneOrder(previousMilestone.id, currentMilestone.order)
      
      // Update local state
      const newMilestones = [...milestones]
      const temp = newMilestones[index].order
      newMilestones[index].order = newMilestones[index - 1].order
      newMilestones[index - 1].order = temp

      setMilestones(newMilestones.sort((a, b) => a.order - b.order))
      toast.success("Ordre mis à jour avec succès")
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de l'ordre")
    }
  }

  const handleMoveDown = async (id: number) => {
    const index = milestones.findIndex((milestone) => milestone.id === id)
    if (index >= milestones.length - 1) return

    try {
      // Get the two milestones that need their order swapped
      const currentMilestone = milestones[index]
      const nextMilestone = milestones[index + 1]
      
      // Update in DB
      await updateMilestoneOrder(currentMilestone.id, nextMilestone.order)
      await updateMilestoneOrder(nextMilestone.id, currentMilestone.order)
      
      // Update local state
      const newMilestones = [...milestones]
      const temp = newMilestones[index].order
      newMilestones[index].order = newMilestones[index + 1].order
      newMilestones[index + 1].order = temp

      setMilestones(newMilestones.sort((a, b) => a.order - b.order))
      toast.success("Ordre mis à jour avec succès")
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de l'ordre")
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce jalon ?")) {
      try {
        await deleteMilestoneFromDb(id)
        setMilestones(milestones.filter((milestone) => milestone.id !== id))
        toast.success("Jalon supprimé avec succès")
      } catch (error) {
        toast.error("Erreur lors de la suppression du jalon")
      }
    }
  }

  const handleEdit = (milestone: Milestone) => {
    setEditingMilestone({ ...milestone })
  }

  const handleAddNew = () => {
    setEditingMilestone({
      id: 0, // This will be replaced by the DB
      year: "",
      title: "",
      description: "",
      order: milestones.length > 0 ? Math.max(...milestones.map(m => m.order)) + 1 : 1,
    })
  }

  const handleSave = async () => {
    if (!editingMilestone) return
    
    setSaving(true)
    try {
      const isNew = editingMilestone.id === 0

      if (isNew) {
        // Create new milestone
        const { id, ...milestoneData } = editingMilestone
        const newId = await createMilestone(milestoneData)
        setMilestones([...milestones, { ...editingMilestone, id: newId }].sort((a, b) => a.order - b.order))
        toast.success("Jalon ajouté avec succès")
      } else {
        // Update existing milestone
        await updateMilestone(editingMilestone)
        setMilestones(
          milestones
            .map((milestone) => (milestone.id === editingMilestone.id ? editingMilestone : milestone))
            .sort((a, b) => a.order - b.order)
        )
        toast.success("Jalon mis à jour avec succès")
      }

      setEditingMilestone(null)
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement du jalon")
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestion des Jalons</h1>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un jalon
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            <span className="ml-2 text-gray-500">Chargement des jalons...</span>
          </div>
        ) : milestones.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-600">Aucun jalon trouvé</h3>
            <p className="text-gray-500 mt-2">Commencez par ajouter un nouveau jalon à votre chronologie</p>
            <Button onClick={handleAddNew} className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Ajouter un jalon
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {milestones.map((milestone) => (
              <Card key={milestone.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/6 flex justify-center">
                      <div className="bg-yellow-600 text-white text-xl font-bold px-4 py-2 rounded">{milestone.year}</div>
                    </div>

                    <div className="md:w-5/6 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{milestone.title}</h3>
                        <p className="text-gray-600 mt-2">{milestone.description}</p>
                        <div className="flex items-center mt-2">
                          <span className="text-sm text-gray-500">Position: {milestone.order}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMoveUp(milestone.id)}
                          disabled={milestone.order === Math.min(...milestones.map(m => m.order))}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMoveDown(milestone.id)}
                          disabled={milestone.order === Math.max(...milestones.map(m => m.order))}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEdit(milestone)}>
                          <Edit className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(milestone.id)}
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
        {editingMilestone && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">
                    {editingMilestone.id !== 0 ? "Modifier le jalon" : "Ajouter un nouveau jalon"}
                  </h2>
                  <Button variant="ghost" size="icon" onClick={() => setEditingMilestone(null)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="year">Année</Label>
                    <Input
                      id="year"
                      value={editingMilestone.year}
                      onChange={(e) => setEditingMilestone({ ...editingMilestone, year: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="title">Titre</Label>
                    <Input
                      id="title"
                      value={editingMilestone.title}
                      onChange={(e) => setEditingMilestone({ ...editingMilestone, title: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={editingMilestone.description || ""}
                      onChange={(e) => setEditingMilestone({ ...editingMilestone, description: e.target.value })}
                      rows={4}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="order">Position</Label>
                    <Input
                      id="order"
                      type="number"
                      min="1"
                      value={editingMilestone.order}
                      onChange={(e) =>
                        setEditingMilestone({ ...editingMilestone, order: Number.parseInt(e.target.value) })
                      }
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <Button variant="outline" onClick={() => setEditingMilestone(null)} disabled={saving}>
                    Annuler
                  </Button>
                  <Button onClick={handleSave} disabled={saving}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Enregistrer
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