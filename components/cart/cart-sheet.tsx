"use client"

import { ShoppingCart } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { CartItem } from "./cart-item"
import { Separator } from "@/components/ui/separator"
import { useEffect, useState } from "react"
import Link from "next/link"

export function CartSheet() {
  const { items, removeItem, updateQuantity, clearCart, isOpen, setIsOpen, totalItems, totalPrice } = useCart()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative bg-white text-black border-gray-300 ">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-yellow-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
          <span className="sr-only">Open cart</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader className="space-y-2.5 pr-6">
          <SheetTitle className="text-xl">Votre Panier ({totalItems})</SheetTitle>
        </SheetHeader>

        {items.length > 0 ? (
          <>
            <div className="flex-1 overflow-auto py-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} onUpdateQuantity={updateQuantity} onRemove={removeItem} />
                ))}
              </div>
            </div>

            <div className="space-y-4 mt-4">
              <Separator />

              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="font-medium">Sous-total</span>
                  <span>{totalPrice.toFixed(2)}BIF</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Livraison</span>
                  <span>Calculé à la caisse</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Taxes</span>
                  <span>Calculé à la caisse</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>{totalPrice.toFixed(2)}BIF</span>
                </div>
              </div>

              <div className="space-y-2">
                {/* <Button asChild className="w-full bg-yellow-600 hover:bg-yellow-700">
                  <Link href="/checkout">Passer à la caisse</Link>
                </Button> */}
                <Button variant="outline" className="w-full" onClick={() => clearCart()}>
                  Vider le panier
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4">
            <div className="rounded-full bg-gray-100 p-6">
              <ShoppingCart className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium">Votre panier est vide</h3>
            <p className="text-center text-gray-500">Vous n&apos;avez pas encore ajouté de produits à votre panier.</p>
            <Button onClick={() => setIsOpen(false)}>Continuer vos achats</Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
