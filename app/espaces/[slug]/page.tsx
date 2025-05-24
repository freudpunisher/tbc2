import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Clock, Phone, Mail, ArrowLeft, CreditCard, ShoppingBag, Gift, Tag, Truck } from "lucide-react"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample shop data - this would come from your database in a real implementation
const localShops = [
  {
    id: 1,
    name: "Bujumbura Centre",
    slug: "bujumbura-centre",
    address: "123 Avenue de la Liberté, Bujumbura",
    description: "Notre boutique principale au cœur de Bujumbura avec une large gamme de produits de qualité.",
    longDescription:
      "Située au cœur de Bujumbura, notre boutique principale offre une expérience d'achat exceptionnelle. Avec un vaste choix de produits de qualité, des conseillers experts et un service client attentionné, nous répondons à tous vos besoins. Notre équipe est là pour vous guider et vous aider à trouver les produits qui correspondent parfaitement à vos attentes.",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    hours: "Lun-Sam: 8h-19h, Dim: 9h-15h",
    phone: "+257 22 123 456",
    email: "centre@tanganyika.com",
    features: [
      "Paiement par carte",
      "Service d'emballage cadeau",
      "Livraison à domicile",
      "Garantie produits",
      "Service après-vente",
      "Commandes spéciales",
    ],
    staff: [
      {
        name: "Jean Ndayishimiye",
        position: "Responsable de boutique",
        image: "/placeholder.svg?height=200&width=200",
      },
      {
        name: "Marie Niyonzima",
        position: "Conseillère clientèle",
        image: "/placeholder.svg?height=200&width=200",
      },
    ],
  },
  {
    id: 2,
    name: "Bujumbura Nord",
    slug: "bujumbura-nord",
    address: "45 Boulevard du 28 Novembre, Bujumbura",
    description: "Une boutique spacieuse dans le quartier nord avec parking client et service personnalisé.",
    longDescription:
      "Notre boutique de Bujumbura Nord offre un cadre spacieux et moderne dans un quartier calme et accessible. Avec un grand parking client et un service personnalisé, c'est l'endroit idéal pour faire vos achats en toute tranquillité. Profitez de notre sélection de produits de qualité et de notre service client exceptionnel pour une expérience d'achat agréable.",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    hours: "Lun-Sam: 8h-19h, Dim: 9h-15h",
    phone: "+257 22 789 012",
    email: "nord@tanganyika.com",
    features: [
      "Paiement par carte",
      "Grand parking",
      "Service d'emballage cadeau",
      "Livraison à domicile",
      "Zone de test produits",
    ],
    staff: [
      {
        name: "Pierre Hakizimana",
        position: "Responsable de boutique",
        image: "/placeholder.svg?height=200&width=200",
      },
      { name: "Claire Uwimana", position: "Conseillère clientèle", image: "/placeholder.svg?height=200&width=200" },
    ],
  },
  {
    id: 3,
    name: "Gitega",
    slug: "gitega",
    address: "78 Rue de l'Indépendance, Gitega",
    description: "Notre nouvelle boutique dans la capitale administrative avec des produits exclusifs.",
    longDescription:
      "Située au cœur de la capitale administrative, notre boutique de Gitega combine élégance et fonctionnalité. Récemment ouverte, elle propose des produits exclusifs et de qualité pour répondre aux besoins des clients les plus exigeants. Avec un design moderne et une atmosphère accueillante, c'est l'endroit idéal pour découvrir nos dernières nouveautés.",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    hours: "Lun-Sam: 8h-19h, Dim: 9h-15h",
    phone: "+257 22 345 678",
    email: "gitega@tanganyika.com",
    features: [
      "Paiement par carte",
      "Produits exclusifs",
      "Service d'emballage cadeau",
      "Livraison à domicile",
      "Espace VIP",
    ],
    staff: [
      { name: "Joseph Nzeyimana", position: "Responsable de boutique", image: "/placeholder.svg?height=200&width=200" },
      {
        name: "Aline Niyonkuru",
        position: "Conseillère clientèle",
        image: "/placeholder.svg?height=200&width=200",
      },
    ],
  },
  {
    id: 4,
    name: "Ngozi",
    slug: "ngozi",
    address: "12 Avenue Rwagasore, Ngozi",
    description: "Une boutique accueillante au nord du pays avec des conseillers experts.",
    longDescription:
      "Notre boutique de Ngozi offre une expérience d'achat personnalisée et chaleureuse dans le nord du pays. Avec des conseillers experts et une sélection de produits adaptés aux besoins locaux, nous répondons aux attentes de notre clientèle. Profitez d'un cadre accueillant et d'un service attentionné pour tous vos achats.",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    hours: "Lun-Sam: 8h-19h, Dim: 9h-15h",
    phone: "+257 22 901 234",
    email: "ngozi@tanganyika.com",
    features: [
      "Paiement par carte",
      "Conseillers experts",
      "Service d'emballage cadeau",
      "Produits locaux",
      "Commandes spéciales",
    ],
    staff: [
      {
        name: "François Bizimana",
        position: "Responsable de boutique",
        image: "/placeholder.svg?height=200&width=200",
      },
      {
        name: "Jeanne Mukeshimana",
        position: "Conseillère clientèle",
        image: "/placeholder.svg?height=200&width=200",
      },
    ],
  },
  {
    id: 5,
    name: "Rumonge",
    slug: "rumonge",
    address: "34 Boulevard du Lac, Rumonge",
    description: "Notre boutique au bord du lac avec une ambiance chaleureuse et des produits locaux.",
    longDescription:
      "Profitez d'une vue imprenable sur le lac Tanganyika dans notre boutique de Rumonge. Conçue pour allier shopping et bien-être, cette boutique offre une ambiance relaxante et une sélection unique de produits locaux. Avec un espace intérieur moderne et une terrasse extérieure, c'est l'endroit parfait pour découvrir nos produits dans un cadre inspirant.",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    hours: "Lun-Sam: 8h-19h, Dim: 9h-15h",
    phone: "+257 22 567 890",
    email: "rumonge@tanganyika.com",
    features: ["Paiement par carte", "Produits locaux", "Vue sur le lac", "Terrasse extérieure", "Café sur place"],
    staff: [
      { name: "Paul Nduwimana", position: "Responsable de boutique", image: "/placeholder.svg?height=200&width=200" },
      {
        name: "Sophie Niyonzima",
        position: "Conseillère clientèle",
        image: "/placeholder.svg?height=200&width=200",
      },
    ],
  },
]

const internationalShops = [
  {
    id: 6,
    name: "Kigali",
    slug: "kigali",
    address: "56 KG 7 Ave, Kigali, Rwanda",
    description: "Notre boutique moderne à Kigali avec une sélection premium de produits internationaux.",
    longDescription:
      "Notre boutique de Kigali offre une expérience d'achat exceptionnelle au cœur de la capitale rwandaise. Avec une sélection premium de produits internationaux et un design contemporain, c'est l'endroit idéal pour les clients exigeants. Profitez d'un environnement élégant, d'un service personnalisé et d'un personnel multilingue pour faciliter votre expérience d'achat.",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    hours: "Lun-Sam: 8h-19h, Dim: 9h-15h",
    phone: "+250 78 123 4567",
    email: "kigali@tanganyika.com",
    features: [
      "Paiement par carte",
      "Produits premium",
      "Service de conciergerie",
      "Espace VIP",
      "Livraison express",
      "Parking sécurisé",
    ],
    staff: [
      { name: "Eric Mugisha", position: "Responsable de boutique", image: "/placeholder.svg?height=200&width=200" },
      { name: "Alice Uwase", position: "Conseillère clientèle", image: "/placeholder.svg?height=200&width=200" },
    ],
  },
  {
    id: 7,
    name: "Nairobi",
    slug: "nairobi",
    address: "123 Kenyatta Avenue, Nairobi, Kenya",
    description: "Une boutique élégante au cœur de Nairobi avec des produits exclusifs d'Afrique de l'Est.",
    longDescription:
      "Située sur la prestigieuse Kenyatta Avenue, notre boutique de Nairobi vous propose une sélection exclusive de produits d'Afrique de l'Est. Avec un design élégant et un service haut de gamme, cet espace offre une expérience d'achat unique pour les clients qui recherchent des produits de qualité. Profitez de notre expertise et de notre équipe expérimentée pour découvrir le meilleur de l'artisanat et des produits est-africains.",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    hours: "Lun-Sam: 8h-19h, Dim: 9h-15h",
    phone: "+254 20 123 4567",
    email: "nairobi@tanganyika.com",
    features: [
      "Paiement par carte",
      "Produits exclusifs",
      "Service d'emballage luxe",
      "Espace événementiel",
      "Service de livraison",
      "Sécurité 24/7",
    ],
    staff: [
      { name: "James Odhiambo", position: "Responsable de boutique", image: "/placeholder.svg?height=200&width=200" },
      { name: "Sarah Wanjiku", position: "Conseillère clientèle", image: "/placeholder.svg?height=200&width=200" },
    ],
  },
  {
    id: 8,
    name: "Dar es Salaam",
    slug: "dar-es-salaam",
    address: "78 Samora Avenue, Dar es Salaam, Tanzanie",
    description: "Notre boutique côtière à Dar es Salaam avec une ambiance unique et des produits locaux.",
    longDescription:
      "Notre boutique de Dar es Salaam combine l'élégance et le charme côtier de la Tanzanie. Située sur Samora Avenue avec une vue imprenable sur l'océan Indien, cette boutique offre une sélection unique de produits locaux et internationaux. Avec un design inspiré par la culture côtière et une équipe dévouée, nous vous proposons une expérience d'achat mémorable dans un cadre exceptionnel.",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    hours: "Lun-Sam: 8h-19h, Dim: 9h-15h",
    phone: "+255 22 123 4567",
    email: "dar@tanganyika.com",
    features: [
      "Paiement par carte",
      "Produits artisanaux",
      "Terrasse vue mer",
      "Service d'emballage cadeau",
      "Livraison à domicile",
      "Climatisation",
    ],
    staff: [
      { name: "Hassan Mwinyi", position: "Responsable de boutique", image: "/placeholder.svg?height=200&width=200" },
      { name: "Fatima Juma", position: "Conseillère clientèle", image: "/placeholder.svg?height=200&width=200" },
    ],
  },
  {
    id: 9,
    name: "Kampala",
    slug: "kampala",
    address: "45 Kampala Road, Kampala, Ouganda",
    description: "Une boutique dynamique au cœur de Kampala avec un large choix de produits de qualité.",
    longDescription:
      "Au cœur de la vibrante capitale ougandaise, notre boutique de Kampala offre une expérience d'achat dynamique et agréable. Située sur Kampala Road, elle bénéficie d'une accessibilité exceptionnelle et propose un large choix de produits de qualité. Notre équipe multilingue est prête à vous conseiller et à vous aider à trouver les produits qui correspondent parfaitement à vos besoins.",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    hours: "Lun-Sam: 8h-19h, Dim: 9h-15h",
    phone: "+256 41 123 4567",
    email: "kampala@tanganyika.com",
    features: [
      "Paiement par carte",
      "Produits locaux et internationaux",
      "Zone de démonstration",
      "Service client multilingue",
      "Livraison à domicile",
      "Espace enfants",
    ],
    staff: [
      { name: "David Okello", position: "Responsable de boutique", image: "/placeholder.svg?height=200&width=200" },
      { name: "Grace Namukasa", position: "Conseillère clientèle", image: "/placeholder.svg?height=200&width=200" },
    ],
  },
]

// Combine all shops
const allShops = [...localShops, ...internationalShops]

// Generate metadata for the page
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const shop = allShops.find((w) => w.slug === params.slug)

  if (!shop) {
    return {
      title: "Boutique non trouvée | Tanganyika Business Company",
      description: "La boutique que vous recherchez n'existe pas.",
    }
  }

  return {
    title: `${shop.name} | Nos Boutiques | Tanganyika Business Company`,
    description: shop.description,
  }
}

export default function ShopDetailPage({ params }: { params: { slug: string } }) {
  // Find the shop by slug from all shops
  const shop = allShops.find((w) => w.slug === params.slug)

  // If shop not found, show 404 page
  if (!shop) {
    notFound()
  }

  // Map features to icons
  const featureIcons: Record<string, React.ReactNode> = {
    "Paiement par carte": <CreditCard className="h-5 w-5" />,
    "Service d'emballage cadeau": <Gift className="h-5 w-5" />,
    "Livraison à domicile": <Truck className="h-5 w-5" />,
    "Garantie produits": <ShoppingBag className="h-5 w-5" />,
    "Produits exclusifs": <Tag className="h-5 w-5" />,
    "Produits premium": <Tag className="h-5 w-5" />,
    "Produits locaux": <Tag className="h-5 w-5" />,
    "Produits artisanaux": <Tag className="h-5 w-5" />,
    "Produits locaux et internationaux": <Tag className="h-5 w-5" />,
  }

  return (
    <div className="container mx-auto px-4 py-24 mt-16">
      <Link href="/espaces" className="inline-flex items-center mb-8 text-blue-600 hover:text-blue-800">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour aux boutiques
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h1 className="text-4xl font-bold mb-4 text-yellow-600">{shop.name}</h1>

          <div className="flex items-start gap-2 text-gray-600 mb-4">
            <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <span>{shop.address}</span>
          </div>

          <p className="text-lg mb-8">{shop.longDescription}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {shop.images.map((image, index) => (
              <div key={index} className="relative h-64 rounded-lg overflow-hidden">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${shop.name} - Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          <Tabs defaultValue="features" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="features">Services</TabsTrigger>
              <TabsTrigger value="hours">Horaires</TabsTrigger>
              <TabsTrigger value="team">Équipe</TabsTrigger>
            </TabsList>

            <TabsContent value="features" className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {shop.features.map((feature, index) => (
                  <Card key={index}>
                    <CardContent className="flex items-center gap-3 p-4">
                      {featureIcons[feature] || <div className="h-5 w-5 bg-yellow-100 rounded-full" />}
                      <span>{feature}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="hours" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <Clock className="h-5 w-5 mt-0.5 text-yellow-600" />
                    <div>
                      <h3 className="font-medium">Heures d'ouverture</h3>
                      <p className="text-gray-600">{shop.hours}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                    <div className="space-y-2">
                      <h4 className="font-medium">Lundi - Samedi</h4>
                      <p>8h00 - 19h00</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Dimanche</h4>
                      <p>9h00 - 15h00</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Jours fériés</h4>
                      <p>Horaires spéciaux</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="team" className="mt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {shop.staff.map((person, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="relative h-20 w-20 rounded-full overflow-hidden">
                          <Image
                            src={person.image || "/placeholder.svg"}
                            alt={person.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-lg">{person.name}</h3>
                          <p className="text-gray-600">{person.position}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card>
            <CardContent className="p-6 space-y-6">
              <h2 className="text-xl font-bold">Contact</h2>

              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 mt-0.5 text-yellow-600" />
                <div>
                  <h3 className="font-medium">Téléphone</h3>
                  <p className="text-gray-600">{shop.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 mt-0.5 text-yellow-600" />
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-gray-600">{shop.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 mt-0.5 text-yellow-600" />
                <div>
                  <h3 className="font-medium">Heures d'ouverture</h3>
                  <p className="text-gray-600">{shop.hours}</p>
                </div>
              </div>

              <div className="pt-4">
                <Button className="w-full">Voir les produits</Button>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Localisation</h2>
            <div className="relative h-64 bg-gray-200 rounded-lg overflow-hidden">
              {/* This would be replaced with an actual map component */}
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-gray-500">Carte interactive</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
