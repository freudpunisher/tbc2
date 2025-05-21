"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle, ShoppingBag } from "lucide-react"
import Link from "next/link"

export default function CheckoutSuccessPage() {
  const router = useRouter()

  // Redirect to home after 10 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push("/")
    }, 10000)

    return () => clearTimeout(timeout)
  }, [router])

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh]">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>

        <h1 className="text-2xl font-bold mb-2">Commande confirmée!</h1>
        <p className="text-gray-600 mb-6">Merci pour votre achat. Votre commande a été traitée avec succès.</p>

        <div className="bg-gray-50 p-4 rounded-md mb-6">
          <p className="text-sm text-gray-500 mb-2">Numéro de commande</p>
          <p className="font-medium">#TBC-{Math.floor(100000 + Math.random() * 900000)}</p>
        </div>

        <p className="text-sm text-gray-500 mb-6">Un email de confirmation a été envoyé à votre adresse email.</p>

        <div className="space-y-3">
          <Button asChild className="w-full bg-yellow-600 hover:bg-yellow-700">
            <Link href="/products">
              <ShoppingBag className="h-4 w-4 mr-2" />
              Continuer vos achats
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
