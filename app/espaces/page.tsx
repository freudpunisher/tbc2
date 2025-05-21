'use client'

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Clock, Phone, ArrowRight, Loader2 } from 'lucide-react'
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Shop {
  id: number
  name: string
  slug: string
  address: string
  description: string
  images: string[]
  hours: string
  phone: string
  email: string
  features: string[]
  location: 'local' | 'international'
  active: boolean
}

// Component to render shop cards
const ShopCard = ({ shop }: { shop: Shop }) => (
  <Card key={shop.id} className="overflow-hidden hover:shadow-lg transition-shadow">
    <div className="relative h-48 w-full">
      <Image 
        src={shop.images && shop.images.length > 0 ? shop.images[0] : "/placeholder.svg?height=300&width=500"} 
        alt={shop.name} 
        fill 
        className="object-cover" 
      />
    </div>
    <CardHeader>
      <CardTitle className="text-xl font-bold text-yellow-600">{shop.name}</CardTitle>
      <div className="flex items-start gap-2 text-gray-600">
        <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
        <span>{shop.address}</span>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <p>{shop.description}</p>

      <div className="flex items-start gap-2 text-gray-600">
        <Clock className="h-5 w-5 mt-0.5 flex-shrink-0" />
        <span>{shop.hours}</span>
      </div>

      <div className="flex items-start gap-2 text-gray-600">
        <Phone className="h-5 w-5 mt-0.5 flex-shrink-0" />
        <span>{shop.phone}</span>
      </div>
    </CardContent>
    <CardFooter>
      <Link href={`/espaces/${shop.slug}`} className="w-full">
        <Button variant="outline" className="w-full group">
          <span>Voir les détails</span>
          <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </Link>
    </CardFooter>
  </Card>
)

export default function ShopsPage() {
  const [shops, setShops] = useState<{
    local: Shop[]
    international: Shop[]
  }>({
    local: [],
    international: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchShops = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/shops')
        
        if (!response.ok) {
          throw new Error('Failed to fetch shops')
        }
        
        const data = await response.json()
        
        // Filter shops by location and active status
        const localShops = data.filter((shop: Shop) => shop.location === 'local' && shop.active)
        const internationalShops = data.filter((shop: Shop) => shop.location === 'international' && shop.active)
        
        setShops({
          local: localShops,
          international: internationalShops
        })
      } catch (error) {
        console.error('Error fetching shops:', error)
        toast.error('Erreur lors du chargement des boutiques')
      } finally {
        setLoading(false)
      }
    }

    fetchShops()
  }, [])

  return (
    <div className="container mx-auto px-4 py-24 mt-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Nos Boutiques</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Découvrez nos boutiques au Burundi et à l'international. Chaque boutique propose une sélection unique de
          produits de qualité pour répondre à vos besoins.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-yellow-600" />
        </div>
      ) : (
        <Tabs defaultValue="local" className="mb-16">
          <TabsList className="w-full max-w-md mx-auto grid grid-cols-2">
            <TabsTrigger value="local">Boutiques Locales</TabsTrigger>
            <TabsTrigger value="international">Boutiques Internationales</TabsTrigger>
          </TabsList>

          <TabsContent value="local" className="mt-8">
            <h2 className="text-2xl font-semibold mb-8 text-center">Nos Boutiques au Burundi</h2>
            {shops.local.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {shops.local.map((shop) => (
                  <ShopCard key={shop.id} shop={shop} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">Aucune boutique locale disponible pour le moment.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="international" className="mt-8">
            <h2 className="text-2xl font-semibold mb-8 text-center">Nos Boutiques à l'International</h2>
            {shops.international.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {shops.international.map((shop) => (
                  <ShopCard key={shop.id} shop={shop} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">Aucune boutique internationale disponible pour le moment.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
