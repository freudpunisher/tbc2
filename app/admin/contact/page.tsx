"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUp, ArrowDown, Edit, Trash2, Plus, X } from "lucide-react"
import { MapPin, Mail, Phone, Clock } from "lucide-react"
import { toast } from "sonner"

// Define types
type ContactItem = {
  id: number
  type: string
  value: string
  icon: string
  order: number
}

// Available icons
const availableIcons = [
  { name: "MapPin", component: MapPin },
  { name: "Mail", component: Mail },
  { name: "Phone", component: Phone },
  { name: "Clock", component: Clock },
]

// Available types
const contactTypes = [
  { value: "address", label: "Adresse" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Téléphone" },
  { value: "hours", label: "Heures d'ouverture" },
  { value: "social", label: "Réseaux sociaux" },
  { value: "other", label: "Autre" },
]

export default function ContactPage() {
  const [contactItems, setContactItems] = useState<ContactItem[]>([])
  const [editingItem, setEditingItem] = useState<ContactItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Fetch contact info on component mount
  useEffect(() => {
    setMounted(true)
    fetchContactInfo()
  }, [])

  const fetchContactInfo = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/contact')
      if (!response.ok) {
        throw new Error('Failed to fetch contact information')
      }
      const data = await response.json()
      setContactItems(data)
    } catch (error) {
      console.error('Error fetching contact information:', error)
      toast.error("Erreur lors du chargement des informations de contact")
    } finally {
      setIsLoading(false)
    }
  }

  if (!mounted) return null

  const handleMoveUp = async (id: number) => {
    const index = contactItems.findIndex((item) => item.id === id)
    if (index <= 0) return

    const newItems = [...contactItems]
    
    // Get the items we need to update
    const currentItem = {...newItems[index]}
    const aboveItem = {...newItems[index - 1]}
    
    // Swap orders
    const tempOrder = currentItem.order
    currentItem.order = aboveItem.order
    aboveItem.order = tempOrder

    try {
      // Update the first item
      await fetch(`/api/contact/${currentItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentItem)
      })
      
      // Update the second item
      await fetch(`/api/contact/${aboveItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aboveItem)
      })

      // Update local state
      newItems[index] = currentItem
      newItems[index - 1] = aboveItem
      setContactItems(newItems.sort((a, b) => a.order - b.order))
      
      toast.success("Position mise à jour avec succès")
    } catch (error) {
      console.error('Error updating positions:', error)
      toast.error("Erreur lors de la mise à jour des positions")
    }
  }

  const handleMoveDown = async (id: number) => {
    const index = contactItems.findIndex((item) => item.id === id)
    if (index >= contactItems.length - 1) return

    const newItems = [...contactItems]
    
    // Get the items we need to update
    const currentItem = {...newItems[index]}
    const belowItem = {...newItems[index + 1]}
    
    // Swap orders
    const tempOrder = currentItem.order
    currentItem.order = belowItem.order
    belowItem.order = tempOrder

    try {
      // Update the first item
      await fetch(`/api/contact/${currentItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentItem)
      })
      
      // Update the second item
      await fetch(`/api/contact/${belowItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(belowItem)
      })

      // Update local state
      newItems[index] = currentItem
      newItems[index + 1] = belowItem
      setContactItems(newItems.sort((a, b) => a.order - b.order))
      
      toast.success("Position mise à jour avec succès")
    } catch (error) {
      console.error('Error updating positions:', error)
      toast.error("Erreur lors de la mise à jour des positions")
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette information de contact ?")) {
      try {
        const response = await fetch(`/api/contact/${id}`, {
          method: 'DELETE'
        })
        
        if (!response.ok) {
          throw new Error('Failed to delete contact item')
        }
        
        setContactItems(contactItems.filter((item) => item.id !== id))
        toast.success("Information de contact supprimée avec succès")
      } catch (error) {
        console.error('Error deleting contact item:', error)
        toast.error("Erreur lors de la suppression de l'information de contact")
      }
    }
  }

  const handleEdit = (item: ContactItem) => {
    setEditingItem({ ...item })
  }

  const handleAddNew = () => {
    setEditingItem({
      id: 0, // Will be assigned by the database
      type: "other",
      value: "",
      icon: "MapPin",
      order: contactItems.length > 0 ? Math.max(...contactItems.map(item => item.order)) + 1 : 1
    })
  }

  const handleSave = async () => {
    if (!editingItem) return
    setIsSaving(true)

    try {
      const isNew = editingItem.id === 0

      if (isNew) {
        // Create new item
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingItem)
        })
        
        if (!response.ok) {
          throw new Error('Failed to create contact item')
        }
        
        const result = await response.json()
        
        // Add the new item to the list with the ID from the database
        setContactItems([...contactItems, { ...editingItem, id: result.id }].sort((a, b) => a.order - b.order))
        toast.success("Information de contact ajoutée avec succès")
      } else {
        // Update existing item
        const response = await fetch(`/api/contact/${editingItem.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingItem)
        })
        
        if (!response.ok) {
          throw new Error('Failed to update contact item')
        }
        
        setContactItems(
          contactItems.map((item) => (item.id === editingItem.id ? editingItem : item)).sort((a, b) => a.order - b.order)
        )
        toast.success("Information de contact mise à jour avec succès")
      }
    } catch (error) {
      console.error('Error saving contact item:', error)
      toast.error("Erreur lors de l'enregistrement de l'information de contact")
    } finally {
      setIsSaving(false)
      setEditingItem(null)
    }
  }

  const getIconComponent = (iconName: string) => {
    const icon = availableIcons.find((i) => i.name === iconName)
    if (!icon) return MapPin
    return icon.component
  }

  const getTypeLabel = (typeValue: string) => {
    const type = contactTypes.find((t) => t.value === typeValue)
    return type ? type.label : typeValue
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestion des Informations de Contact</h1>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une information
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">Chargement des informations de contact...</p>
          </div>
        ) : contactItems.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-gray-500 mb-4">Aucune information de contact trouvée</p>
            <Button onClick={handleAddNew}>
              <Plus className="mr-2 h-4 w-4" />
              Ajouter une information
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {contactItems.map((item) => {
              const IconComponent = getIconComponent(item.icon)
              return (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/6 flex justify-center">
                        <div className="bg-yellow-50 w-16 h-16 rounded-full flex items-center justify-center">
                          <IconComponent className="h-8 w-8 text-yellow-600" />
                        </div>
                      </div>

                      <div className="md:w-5/6 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between">
                            <h3 className="text-lg font-semibold">{getTypeLabel(item.type)}</h3>
                          </div>
                          <p className="text-gray-600 mt-2 whitespace-pre-line">{item.value}</p>
                          <div className="flex items-center mt-2">
                            <span className="text-sm text-gray-500">Position: {item.order}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMoveUp(item.id)}
                            disabled={item.order === 1}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMoveDown(item.id)}
                            disabled={item.order === contactItems.length}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                            <Edit className="h-4 w-4 mr-1" />
                            Modifier
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDelete(item.id)}
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
        {editingItem && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">
                    {editingItem.id !== 0
                      ? "Modifier l'information de contact"
                      : "Ajouter une nouvelle information de contact"}
                  </h2>
                  <Button variant="ghost" size="icon" onClick={() => setEditingItem(null)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select
                      value={editingItem.type}
                      onValueChange={(value) => setEditingItem({ ...editingItem, type: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                      <SelectContent>
                        {contactTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="value">Valeur</Label>
                    <Textarea
                      id="value"
                      value={editingItem.value}
                      onChange={(e) => setEditingItem({ ...editingItem, value: e.target.value })}
                      rows={4}
                      className="mt-1"
                      placeholder="Utilisez des sauts de ligne pour séparer plusieurs valeurs"
                    />
                  </div>

                  <div>
                    <Label htmlFor="icon">Icône</Label>
                    <Select
                      value={editingItem.icon}
                      onValueChange={(value) => setEditingItem({ ...editingItem, icon: value })}
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
                      value={editingItem.order}
                      onChange={(e) => setEditingItem({ ...editingItem, order: Number.parseInt(e.target.value) })}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <Button variant="outline" onClick={() => setEditingItem(null)} disabled={isSaving}>
                    Annuler
                  </Button>
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? "Enregistrement..." : "Enregistrer"}
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