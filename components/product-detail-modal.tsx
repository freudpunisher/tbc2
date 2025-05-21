"use client"

import { useState } from "react"
import Image from "next/image"
import { X, Star, ShoppingBag, Heart, Share2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export interface ProductDetailProps {
  id: number
  name: string
  price: number
  category?: string
  brand?: string
  description?: string
  isNew?: boolean
  isBestseller?: boolean
  image: string
}

interface ProductDetailModalProps {
  product: ProductDetailProps | null
  isOpen: boolean
  onClose: () => void
}

export function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  if (!product) return null

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity,
      category: product.category,
    })

    // Show added confirmation
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleIncreaseQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const handleDecreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
  }

  // Generate a placeholder description if none is provided
  const description =
    product.description ||
    "Ce produit de haute qualité est conçu pour répondre à vos besoins quotidiens. Fabriqué avec des matériaux durables et un souci du détail, il offre une performance exceptionnelle et une longue durée de vie. Parfait pour une utilisation à la maison ou au bureau."

  // Modal animation variants
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
  }

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6">
          <motion.div
            className="fixed inset-0 bg-black/50"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={backdropVariants}
            onClick={onClose}
          />

          <motion.div
            className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 z-10"
              onClick={onClose}
              aria-label="Fermer"
            >
              <X className="h-5 w-5" />
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              {/* Product Image */}
              <div className="relative h-80 md:h-full rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>

                {/* Product badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isNew && <Badge className="bg-blue-700">Nouveau</Badge>}
                  {product.isBestseller && <Badge className="bg-yellow-600">Top Vente</Badge>}
                </div>
              </div>

              {/* Product Details */}
              <div className="flex flex-col">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold">{product.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${star <= 4 ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">(24 avis)</span>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-2xl font-bold text-yellow-600">${product.price}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Catégorie: <span className="font-medium">{product.category || "Non spécifié"}</span>
                  </p>
                  {product.brand && (
                    <p className="text-sm text-gray-500">
                      Marque: <span className="font-medium">{product.brand}</span>
                    </p>
                  )}
                </div>

                <Tabs defaultValue="description" className="mb-6">
                  <TabsList>
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="specifications">Spécifications</TabsTrigger>
                  </TabsList>
                  <TabsContent value="description" className="text-gray-700 mt-4">
                    <p>{description}</p>
                  </TabsContent>
                  <TabsContent value="specifications" className="mt-4">
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex justify-between border-b pb-2">
                        <span className="font-medium">Dimensions</span>
                        <span>10 x 20 x 5 cm</span>
                      </li>
                      <li className="flex justify-between border-b pb-2">
                        <span className="font-medium">Poids</span>
                        <span>0.5 kg</span>
                      </li>
                      <li className="flex justify-between border-b pb-2">
                        <span className="font-medium">Matériaux</span>
                        <span>Plastique, Métal</span>
                      </li>
                      <li className="flex justify-between border-b pb-2">
                        <span className="font-medium">Couleur</span>
                        <span>Noir</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="font-medium">Garantie</span>
                        <span>1 an</span>
                      </li>
                    </ul>
                  </TabsContent>
                </Tabs>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center border rounded-md">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-none"
                      onClick={handleDecreaseQuantity}
                    >
                      <span className="text-xl">-</span>
                    </Button>
                    <span className="w-10 text-center">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-none"
                      onClick={handleIncreaseQuantity}
                    >
                      <span className="text-xl">+</span>
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Disponibilité:</span> En stock
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-auto">
                  <Button
                    className={`flex-1 ${added ? "bg-green-600 hover:bg-green-700" : "bg-yellow-600 hover:bg-yellow-700"}`}
                    onClick={handleAddToCart}
                  >
                    {added ? "Ajouté au panier" : "Ajouter au panier"}
                    <ShoppingBag className="ml-2 h-5 w-5" />
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Heart className="h-5 w-5" />
                      <span className="sr-only">Ajouter aux favoris</span>
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full">
                      <Share2 className="h-5 w-5" />
                      <span className="sr-only">Partager</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
