"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { ProductDetailModal, type ProductDetailProps } from "@/components/product-detail-modal"

interface ProductCardProps {
  product: {
    id: number
    name: string
    price: number
    category?: string
    brand?: string
    isNew?: boolean
    isBestseller?: boolean
  }
  image: string
  variants?: "fadeInUp"
}

export function ProductCard({ product, image, variants }: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  const productDetail: ProductDetailProps = {
    ...product,
    image,
  }

  return (
    <>
      <motion.div
        variants={variants}
        className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
      >
        <div className="relative h-64">
          {product.isNew && (
            <div className="absolute top-0 right-0 bg-blue-700 text-white px-3 py-1 z-10 rounded-bl-lg">Nouveau</div>
          )}
          {product.isBestseller && (
            <div className="absolute top-0 right-0 bg-yellow-600 text-white px-3 py-1 z-10 rounded-bl-lg">
              Top Vente
            </div>
          )}
          <Image src={image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold truncate">{product.name}</h3>
          <p className="font-bold text-yellow-600 mt-1">${product.price}</p>
          <div className="flex flex-col gap-2 mt-3">
            <Button size="sm" variant="outline" onClick={openModal} className="w-full">
              Voir
            </Button>
            <AddToCartButton product={product} image={image} fullWidth />
          </div>
        </div>
      </motion.div>

      <ProductDetailModal product={productDetail} isOpen={isModalOpen} onClose={closeModal} />
    </>
  )
}
