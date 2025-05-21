"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUp, ArrowDown, Edit, Trash2, Plus, X, Loader2 } from "lucide-react"
import { CheckCircle, Users, TrendingUp, Award } from "lucide-react"
import { toast } from "sonner"

// Define type for company values
type CompanyValue = {
  id: number
  title: string
  description: string | null
  icon: string | null
  order: number
}

// Available icons
const availableIcons = [
  { name: "CheckCircle", component: CheckCircle },
  { name: "Users", component: Users },
  { name: "TrendingUp", component: TrendingUp },
  { name: "Award", component: Award },
]

export default function ValuesPage() {
  const [values, setValues] = useState<CompanyValue[]>([])
  const [editingValue, setEditingValue] = useState<CompanyValue | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Fetch company values from API
  useEffect(() => {
    const fetchValues = async () => {
      try {
        const response = await fetch('/api/values')
        if (!response.ok) throw new Error('Failed to fetch values')
        const data = await response.json()
        setValues(data)
      } catch (error) {
        console.error('Error loading company values:', error)
        toast.error('Impossible de charger les valeurs')
      } finally {
        setIsLoading(false)
      }
    }

    fetchValues()
  }, [])

  const handleMoveUp = async (id: number) => {
    const index = values.findIndex((value) => value.id === id)
    if (index <= 0) return

    try {
      // Calculate new orders
      const currentValue = values[index]
      const prevValue = values[index - 1]
      
      // Update in DB
      await Promise.all([
        fetch(`/api/values/${currentValue.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...currentValue, order: prevValue.order })
        }),
        fetch(`/api/values/${prevValue.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...prevValue, order: currentValue.order })
        })
      ])

      // Update state
      const newValues = [...values]
      newValues[index].order = prevValue.order
      newValues[index - 1].order = currentValue.order
      setValues(newValues.sort((a, b) => a.order - b.order))
      
      toast.success('Position mise à jour')
    } catch (error) {
      console.error('Error updating order:', error)
      toast.error('Échec de la mise à jour de la position')
    }
  }

  const handleMoveDown = async (id: number) => {
    const index = values.findIndex((value) => value.id === id)
    if (index >= values.length - 1) return

    try {
      // Calculate new orders
      const currentValue = values[index]
      const nextValue = values[index + 1]
      
      // Update in DB
      await Promise.all([
        fetch(`/api/values/${currentValue.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...currentValue, order: nextValue.order })
        }),
        fetch(`/api/values/${nextValue.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...nextValue, order: currentValue.order })
        })
      ])

      // Update state
      const newValues = [...values]
      newValues[index].order = nextValue.order
      newValues[index + 1].order = currentValue.order
      setValues(newValues.sort((a, b) => a.order - b.order))
      
      toast.success('Position mise à jour')
    } catch (error) {
      console.error('Error updating order:', error)
      toast.error('Échec de la mise à jour de la position')
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette valeur ?")) {
      return
    }
    
    try {
      const response = await fetch(`/api/values/${id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Failed to delete')
      
      // Remove from state
      setValues(values.filter(value => value.id !== id))
      toast.success('Valeur supprimée')
    } catch (error) {
      console.error('Error deleting value:', error)
      toast.error('Échec de la suppression')
    }
  }

  const handleEdit = (value: CompanyValue) => {
    setEditingValue({ ...value })
  }

  const handleAddNew = () => {
    const maxOrder = values.length > 0 
      ? Math.max(...values.map(value => value.order)) 
      : 0
      
    setEditingValue({
      id: 0, // Will be assigned by database
      title: "",
      description: "",
      icon: "CheckCircle",
      order: maxOrder + 1,
    } as CompanyValue)
  }

  const handleSave = async () => {
    if (!editingValue || !editingValue.title) {
      toast.error('Le titre est requis')
      return
    }

    setIsSaving(true)
    try {
      const isNew = editingValue.id === 0
      const method = isNew ? 'POST' : 'PUT'
      const url = isNew ? '/api/values' : `/api/values/${editingValue.id}`
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editingValue)
      })
      
      if (!response.ok) throw new Error('Failed to save')
      const result = await response.json()
      
      if (isNew) {
        // Update with correct ID from database
        setValues([...values, { ...editingValue, id: result.id }].sort((a, b) => a.order - b.order))
      } else {
        // Update existing value
        setValues(values.map(v => v.id === editingValue.id ? editingValue : v).sort((a, b) => a.order - b.order))
      }
      
      setEditingValue(null)
      toast.success(isNew ? 'Valeur ajoutée' : 'Valeur mise à jour')
    } catch (error) {
      console.error('Error saving value:', error)
      toast.error('Échec de l\'enregistrement')
    } finally {
      setIsSaving(false)
    }
  }

  const getIconComponent = (iconName: string | null) => {
    if (!iconName) return CheckCircle
    const icon = availableIcons.find((i) => i.name === iconName)
    if (!icon) return CheckCircle
    return icon.component
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          <span className="ml-2 text-gray-500">Chargement des valeurs...</span>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestion des Valeurs</h1>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une valeur
          </Button>
        </div>

        {values.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500">Aucune valeur trouvée</p>
            <Button className="mt-4" onClick={handleAddNew}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter votre première valeur
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {values.map((value) => {
              const IconComponent = getIconComponent(value.icon)
              return (
                <Card key={value.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/6 flex justify-center">
                        <div className="bg-yellow-50 w-16 h-16 rounded-full flex items-center justify-center">
                          <IconComponent className="h-8 w-8 text-yellow-600" />
                        </div>
                      </div>

                      <div className="md:w-5/6 flex flex-col justify-between">
                        <div>
                          <h3 className="text-lg font-semibold">{value.title}</h3>
                          <p className="text-gray-600 mt-2">{value.description}</p>
                          <div className="flex items-center mt-2">
                            <span className="text-sm text-gray-500">Position: {value.order}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMoveUp(value.id)}
                            disabled={value.order === Math.min(...values.map(v => v.order))}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMoveDown(value.id)}
                            disabled={value.order === Math.max(...values.map(v => v.order))}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleEdit(value)}>
                            <Edit className="h-4 w-4 mr-1" />
                            Modifier
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDelete(value.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Supprimer
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Edit Modal */}
        {editingValue && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">
                    {editingValue.id !== 0 ? "Modifier la valeur" : "Ajouter une nouvelle valeur"}
                  </h2>
                  <Button variant="ghost" size="icon" onClick={() => setEditingValue(null)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Titre</Label>
                    <Input
                      id="title"
                      value={editingValue.title}
                      onChange={(e) => setEditingValue({ ...editingValue, title: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={editingValue.description || ''}
                      onChange={(e) => setEditingValue({ ...editingValue, description: e.target.value })}
                      rows={4}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="icon">Icône</Label>
                    <Select
                      value={editingValue.icon || 'CheckCircle'}
                      onValueChange={(value) => setEditingValue({ ...editingValue, icon: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Sélectionner une icône" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableIcons.map((icon) => (
                          <SelectItem key={icon.name} value={icon.name}>
                            <div className="flex items-center">
                              <icon.component className="h-4 w-4 mr-2" />
                              {icon.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="order">Position</Label>
                    <Input
                      id="order"
                      type="number"
                      min="1"
                      value={editingValue.order}
                      onChange={(e) => setEditingValue({ ...editingValue, order: Number.parseInt(e.target.value) })}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <Button variant="outline" onClick={() => setEditingValue(null)} disabled={isSaving}>
                    Annuler
                  </Button>
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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