"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { CartItem } from "@/components/cart/cart-item"
import { ArrowLeft, CreditCard, Truck } from "lucide-react"
import Link from "next/link"

export default function CheckoutPage() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice, clearCart } = useCart()
  const [mounted, setMounted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const router = useRouter()

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Redirect to home if cart is empty
  useEffect(() => {
    if (mounted && items.length === 0) {
      router.push("/")
    }
  }, [mounted, items, router])

  if (!mounted) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate order processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Clear cart and redirect to success page
    clearCart()
    router.push("/checkout/success")
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center mb-8">
        <Link href="/" className="flex items-center text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Link>
        <h1 className="text-2xl font-bold ml-auto mr-auto">Finaliser votre commande</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Summary */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Récapitulatif de la commande</h2>

            <div className="space-y-4">
              {items.map((item) => (
                <CartItem key={item.id} item={item} onUpdateQuantity={updateQuantity} onRemove={removeItem} />
              ))}
            </div>
          </div>

          {/* Shipping Information */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Informations de livraison</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <Label htmlFor="firstName">Prénom</Label>
                <Input id="firstName" required />
              </div>
              <div>
                <Label htmlFor="lastName">Nom</Label>
                <Input id="lastName" required />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required />
              </div>
              <div>
                <Label htmlFor="phone">Téléphone</Label>
                <Input id="phone" type="tel" required />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address">Adresse</Label>
                <Input id="address" required />
              </div>
              <div>
                <Label htmlFor="city">Ville</Label>
                <Input id="city" required />
              </div>
              <div>
                <Label htmlFor="postalCode">Code postal</Label>
                <Input id="postalCode" required />
              </div>
            </div>

            <h2 className="text-xl font-semibold mb-4">Mode de paiement</h2>

            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="mb-6">
              <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-gray-50">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex items-center cursor-pointer">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Carte de crédit
                </Label>
              </div>
              <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-gray-50 mt-2">
                <RadioGroupItem value="cash" id="cash" />
                <Label htmlFor="cash" className="flex items-center cursor-pointer">
                  <Truck className="h-5 w-5 mr-2" />
                  Paiement à la livraison
                </Label>
              </div>
            </RadioGroup>

            {paymentMethod === "card" && (
              <div className="space-y-4 mb-6">
                <div>
                  <Label htmlFor="cardNumber">Numéro de carte</Label>
                  <Input id="cardNumber" placeholder="1234 5678 9012 3456" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate">Date d&apos;expiration</Label>
                    <Input id="expiryDate" placeholder="MM/YY" required />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" placeholder="123" required />
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-4">Résumé</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Sous-total ({totalItems} articles)</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Livraison</span>
                <span>$10.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Taxes</span>
                <span>${(totalPrice * 0.18).toFixed(2)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${(totalPrice + 10 + totalPrice * 0.18).toFixed(2)}</span>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-yellow-600 hover:bg-yellow-700"
              disabled={isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? "Traitement en cours..." : "Confirmer la commande"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
