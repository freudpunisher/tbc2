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
import { toast } from "sonner"

// Available categories
const categories = [
  { value: "livraison", label: "Livraison" },
  { value: "retours", label: "Retours et remboursements" },
  { value: "paiement", label: "Paiement" },
  { value: "services", label: "Services" },
  { value: "produits", label: "Produits" },
  { value: "autre", label: "Autre" },
]

// Type definition for FAQ item
type FaqItem = {
  id: number
  question: string
  answer: string
  category: string
  order: number
}

export default function FaqPage() {
  const [faqItems, setFaqItems] = useState<FaqItem[]>([])
  const [editingItem, setEditingItem] = useState<FaqItem | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState<number | null>(null)
  const [isReordering, setIsReordering] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

  // Fetch FAQ items on component mount
  useEffect(() => {
    setMounted(true)
    fetchFaqItems()
  }, [])

  if (!mounted) return null

  async function fetchFaqItems() {
    setIsLoading(true)
    try {
      const response = await fetch("/api/faq")
      if (!response.ok) throw new Error("Failed to fetch FAQ items")
      const data = await response.json()
      setFaqItems(data)
    } catch (error) {
      console.error("Error fetching FAQ items:", error)
      toast.error("Échec du chargement des FAQ")
    } finally {
      setIsLoading(false)
    }
  }

  const handleMoveUp = async (id: number) => {
    const index = faqItems.findIndex((item) => item.id === id)
    if (index <= 0) return

    setIsReordering(id)
    
    // Get the two items we need to swap
    const currentItem = faqItems[index]
    const prevItem = faqItems[index - 1]
    
    // Swap their orders
    const updatedCurrentItem = { ...currentItem, order: prevItem.order }
    const updatedPrevItem = { ...prevItem, order: currentItem.order }
    
    try {
      // Update both items in the database
      const [responseA, responseB] = await Promise.all([
        fetch(`/api/faq/${updatedCurrentItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedCurrentItem),
        }),
        fetch(`/api/faq/${updatedPrevItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedPrevItem),
        }),
      ])
      
      if (!responseA.ok || !responseB.ok) throw new Error("Failed to update order")
      
      // Update local state
      const newItems = [...faqItems]
      newItems[index] = updatedCurrentItem
      newItems[index - 1] = updatedPrevItem
      setFaqItems(newItems.sort((a, b) => a.order - b.order))
      toast.success("Ordre mis à jour avec succès")
    } catch (error) {
      console.error("Error updating order:", error)
      toast.error("Échec de la mise à jour de l'ordre")
      // Revert to original state by refetching
      fetchFaqItems()
    } finally {
      setIsReordering(null)
    }
  }

  const handleMoveDown = async (id: number) => {
    const index = faqItems.findIndex((item) => item.id === id)
    if (index >= faqItems.length - 1) return

    setIsReordering(id)
    
    // Get the two items we need to swap
    const currentItem = faqItems[index]
    const nextItem = faqItems[index + 1]
    
    // Swap their orders
    const updatedCurrentItem = { ...currentItem, order: nextItem.order }
    const updatedNextItem = { ...nextItem, order: currentItem.order }
    
    try {
      // Update both items in the database
      const [responseA, responseB] = await Promise.all([
        fetch(`/api/faq/${updatedCurrentItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedCurrentItem),
        }),
        fetch(`/api/faq/${updatedNextItem.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedNextItem),
        }),
      ])
      
      if (!responseA.ok || !responseB.ok) throw new Error("Failed to update order")
      
      // Update local state
      const newItems = [...faqItems]
      newItems[index] = updatedCurrentItem
      newItems[index + 1] = updatedNextItem
      setFaqItems(newItems.sort((a, b) => a.order - b.order))
      toast.success("Ordre mis à jour avec succès")
    } catch (error) {
      console.error("Error updating order:", error)
      toast.error("Échec de la mise à jour de l'ordre")
      // Revert to original state by refetching
      fetchFaqItems()
    } finally {
      setIsReordering(null)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette question ?")) {
      return
    }
    
    setIsDeleting(id)
    try {
      const response = await fetch(`/api/faq/${id}`, {
        method: "DELETE",
      })
      
      if (!response.ok) throw new Error("Failed to delete FAQ item")
      
      // Remove from local state
      setFaqItems(faqItems.filter((item) => item.id !== id))
      toast.success("Question supprimée avec succès")
      
      // Reindex remaining items if needed
      await reindexFaqItems()
    } catch (error) {
      console.error("Error deleting FAQ item:", error)
      toast.error("Échec de la suppression")
    } finally {
      setIsDeleting(null)
    }
  }

  // Helper function to reindex FAQ item orders after deletion
  async function reindexFaqItems() {
    if (faqItems.length === 0) return
    
    const updatedItems = faqItems
      .filter(item => item.id !== isDeleting) // Exclude the item being deleted
      .map((item, index) => ({
        ...item,
        order: index + 1
      }))
    
    try {
      // Update all items with new order values
      await Promise.all(
        updatedItems.map(item => 
          fetch(`/api/faq/${item.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item),
          })
        )
      )
      
      // Refetch to get the updated order values
      fetchFaqItems()
    } catch (error) {
      console.error("Error reindexing FAQ items:", error)
    }
  }

  const handleEdit = (item: FaqItem) => {
    setEditingItem({ ...item })
  }

  const handleAddNew = () => {
    const nextOrder = faqItems.length > 0 
      ? Math.max(...faqItems.map((item) => item.order)) + 1 
      : 1
      
    setEditingItem({
      id: 0, // Will be assigned by the database
      question: "",
      answer: "",
      category: "autre",
      order: nextOrder,
    })
  }

  const handleSave = async () => {
    if (!editingItem) return
    
    setIsSaving(true)
    try {
      const isNew = editingItem.id === 0
      
      // Create new item or update existing one
      const response = await fetch(isNew ? "/api/faq" : `/api/faq/${editingItem.id}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingItem),
      })
      
      if (!response.ok) throw new Error(isNew ? "Failed to create FAQ item" : "Failed to update FAQ item")
      
      if (isNew) {
        const result = await response.json()
        // Add the new item with the ID from the response
        setFaqItems([...faqItems, { ...editingItem, id: result.id }].sort((a, b) => a.order - b.order))
      } else {
        // Update existing item
        setFaqItems(
          faqItems.map((item) => (item.id === editingItem.id ? editingItem : item))
            .sort((a, b) => a.order - b.order)
        )
      }
      
      toast.success(isNew ? "Question ajoutée avec succès" : "Question mise à jour avec succès")
      setEditingItem(null)
    } catch (error) {
      console.error("Error saving FAQ item:", error)
      toast.error("Échec de l'enregistrement")
    } finally {
      setIsSaving(false)
    }
  }

  const getCategoryLabel = (categoryValue: string) => {
    const category = categories.find((cat) => cat.value === categoryValue)
    return category ? category.label : categoryValue
  }

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="p-6 flex justify-center items-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-2">Chargement des FAQ...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Gestion des FAQ</h1>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une question
          </Button>
        </div>

        {faqItems.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-500">Aucune question FAQ n'est disponible. Cliquez sur "Ajouter une question" pour commencer.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {faqItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4">
                    <div>
                      <div className="flex justify-between">
                        <h3 className="text-lg font-semibold">{item.question}</h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {getCategoryLabel(item.category)}
                        </span>
                      </div>
                      <p className="text-gray-600 mt-2">{item.answer}</p>
                      <div className="flex items-center mt-2">
                        <span className="text-sm text-gray-500">Position: {item.order}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMoveUp(item.id)}
                        disabled={item.order === 1 || isReordering !== null}
                      >
                        {isReordering === item.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <ArrowUp className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMoveDown(item.id)}
                        disabled={item.order === faqItems.length || isReordering !== null}
                      >
                        {isReordering === item.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <ArrowDown className="h-4 w-4" />
                        )}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEdit(item)}
                        disabled={isDeleting !== null || isReordering !== null}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Modifier
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(item.id)}
                        disabled={isDeleting !== null || isReordering !== null}
                      >
                        {isDeleting === item.id ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-1" />
                        ) : (
                          <Trash2 className="h-4 w-4 mr-1" />
                        )}
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Edit Modal */}
        {editingItem && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">
                    {editingItem.id !== 0 ? "Modifier la question" : "Ajouter une nouvelle question"}
                  </h2>
                  <Button variant="ghost" size="icon" onClick={() => setEditingItem(null)} disabled={isSaving}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="question">Question</Label>
                    <Input
                      id="question"
                      value={editingItem.question}
                      onChange={(e) => setEditingItem({ ...editingItem, question: e.target.value })}
                      className="mt-1"
                      disabled={isSaving}
                    />
                  </div>

                  <div>
                    <Label htmlFor="answer">Réponse</Label>
                    <Textarea
                      id="answer"
                      value={editingItem.answer}
                      onChange={(e) => setEditingItem({ ...editingItem, answer: e.target.value })}
                      rows={6}
                      className="mt-1"
                      disabled={isSaving}
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Catégorie</Label>
                    <Select
                      value={editingItem.category}
                      onValueChange={(value) => setEditingItem({ ...editingItem, category: value })}
                      disabled={isSaving}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Sélectionner une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
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
                      onChange={(e) => setEditingItem({ ...editingItem, order: Number.parseInt(e.target.value) || 1 })}
                      className="mt-1"
                      disabled={isSaving}
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <Button variant="outline" onClick={() => setEditingItem(null)} disabled={isSaving}>
                    Annuler
                  </Button>
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enregistrement...
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