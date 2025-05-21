"use client"

import { useState } from "react"
import { ShoppingCart, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"

interface AddToCartButtonProps {
  product: {
    id: number
    name: string
    price: number
    category?: string
  }
  image: string
  fullWidth?: boolean
}

export function AddToCartButton({ product, image, fullWidth = false }: AddToCartButtonProps) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: image,
      quantity: 1,
      category: product.category,
    })

    // Show added confirmation
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <Button
      onClick={handleAddToCart}
      className={`${added ? "bg-green-600 hover:bg-green-700" : ""} ${fullWidth ? "w-full" : ""}`}
      size="sm"
    >
      {added ? (
        <>
          <Check className="h-4 w-4 mr-2" />
          Ajouté
        </>
      ) : (
        <>
          <ShoppingCart className="h-4 w-4 mr-2" />
          Ajouter au panier
        </>
      )}
    </Button>
  )
}
