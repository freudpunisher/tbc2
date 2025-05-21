"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { ProductCard } from "@/components/product-card"
import { Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast" // Added toast for error handling
import { SiteFooter } from "@/components/site-footer"

// Define types
type CarouselImage = {
  id: number
  title: string | null
  subtitle: string | null
  imageUrl: string
  order: number
  active: boolean
}

type Product = {
  id: number
  name: string
  price: number
  category: string
  brand: string
  isBestseller?: boolean
  isNew?: boolean
  image?: string
}

// New type for About Content
type AboutContent = {
  id: number
  section: string
  title: string | null
  content: string | null
  imageUrl: string | null
}

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0)
  const [carouselImages, setCarouselImages] = useState<CarouselImage[]>([])
  const [carouselLoading, setCarouselLoading] = useState(true)
  const [carouselError, setCarouselError] = useState<string | null>(null)
  
  const [bestsellerProducts, setBestsellerProducts] = useState<Product[]>([])
  const [newProducts, setNewProducts] = useState<Product[]>([])
  const [productsLoading, setProductsLoading] = useState(true)
  const [productsError, setProductsError] = useState<string | null>(null)

  // New state for about content
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null)
  const [aboutLoading, setAboutLoading] = useState(true)
  const [aboutError, setAboutError] = useState<string | null>(null)

  // Get total slides count from fetched carousel images (only active ones)
  const activeCarouselImages = carouselImages.filter(img => img.active)
  const totalSlides = activeCarouselImages.length

  // Fetch carousel images from the API
  useEffect(() => {
    const fetchCarouselImages = async () => {
      try {
        setCarouselLoading(true)
        const response = await fetch("/api/carousel")
        
        if (!response.ok) {
          throw new Error("Failed to fetch carousel images")
        }
        
        const data = await response.json()
        // Sort by order field
        const sortedData = data.sort((a: CarouselImage, b: CarouselImage) => a.order - b.order)
        setCarouselImages(sortedData)
        setCarouselError(null)
      } catch (error) {
        console.error("Error fetching carousel images:", error)
        setCarouselError("Impossible de charger les images du carousel")
        toast({
          title: "Erreur",
          description: "Impossible de charger les images du carousel. Utilisation des images par défaut.",
          variant: "destructive",
        })
      } finally {
        setCarouselLoading(false)
      }
    }
    
    fetchCarouselImages()
  }, [])

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true)
        const response = await fetch('/api/products')
        
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        
        const data = await response.json()
        
        // Filter bestsellers and new products
        const bestsellers = data.filter((product: Product) => product.isBestseller).slice(0, 4)
        const newItems = data.filter((product: Product) => product.isNew).slice(0, 4)
        
        setBestsellerProducts(bestsellers)
        setNewProducts(newItems)
        setProductsError(null)
      } catch (err) {
        console.error('Error fetching products:', err)
        setProductsError(err instanceof Error ? err.message : 'An error occurred')
        toast({
          title: "Erreur",
          description: "Impossible de charger les produits. Utilisation des données par défaut.",
          variant: "destructive",
        })
      } finally {
        setProductsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // New effect to fetch about content
  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        setAboutLoading(true)
        const response = await fetch('/api/about')
        
        if (!response.ok) {
          throw new Error('Failed to fetch about content')
        }
        
        const data = await response.json()
        
        // Get the first "story" section content item
        // This is for the homepage about section
        const storyContent = data.find((item: AboutContent) => item.section === 'story')
        setAboutContent(storyContent || null)
        setAboutError(null)
      } catch (err) {
        console.error('Error fetching about content:', err)
        setAboutError(err instanceof Error ? err.message : 'An error occurred')
        toast({
          title: "Erreur",
          description: "Impossible de charger le contenu à propos. Utilisation du contenu par défaut.",
          variant: "destructive",
        })
      } finally {
        setAboutLoading(false)
      }
    }

    fetchAboutContent()
  }, [])

  // Auto-advance slider
  useEffect(() => {
    if (totalSlides <= 1) return

    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % totalSlides)
    }, 5000)

    return () => {
      clearInterval(interval)
    }
  }, [totalSlides])

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  // Fallback slides in case no carousel images are available
  const fallbackSlides = [
    "/placeholder.svg?height=600&width=1200",
    "/placeholder.svg?height=600&width=1200",
    "/placeholder.svg?height=600&width=1200",
  ]

  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* Hero Slider */}
      <section className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10" />

        {carouselLoading ? (
          <div className="absolute inset-0 flex items-center justify-center z-30 text-white">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <span>Chargement...</span>
          </div>
        ) : carouselError ? (
          <div className="absolute inset-0 flex items-center justify-center z-30 text-white">
            <p>{carouselError}</p>
          </div>
        ) : activeCarouselImages.length > 0 ? (
          // Display dynamic carousel images
          activeCarouselImages.map((img, index) => (
            <motion.div
              key={img.id}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{
                opacity: activeSlide === index ? 1 : 0,
                scale: activeSlide === index ? 1 : 1.1,
              }}
              transition={{ duration: 1 }}
            >
              <Image
                src={img.imageUrl}
                alt={img.title || `Tanganyika Business Company - Slide ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </motion.div>
          ))
        ) : (
          // Fallback to placeholder images
          fallbackSlides.map((img, index) => (
            <motion.div
              key={index}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{
                opacity: activeSlide === index ? 1 : 0,
                scale: activeSlide === index ? 1 : 1.1,
              }}
              transition={{ duration: 1 }}
            >
              <Image
                src={img}
                alt={`Tanganyika Business Company - Slide ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </motion.div>
          ))
        )}

        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {(activeCarouselImages.length > 0 ? activeCarouselImages : fallbackSlides).map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                activeSlide === index ? "bg-white w-6" : "bg-white/50"
              }`}
              onClick={() => setActiveSlide(index)}
            />
          ))}
        </div>

        <div className="absolute inset-0 flex items-center justify-center z-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-center text-white px-4"
          >
            {/* Show slide title and subtitle if available */}
            {!carouselLoading && !carouselError && activeCarouselImages.length > 0 ? (
              <>
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  {activeCarouselImages[activeSlide]?.title || "TANGANYIKA BUSINESS COMPANY"}
                </h1>
                <p className="text-xl md:text-2xl max-w-2xl mx-auto">
                  {activeCarouselImages[activeSlide]?.subtitle || "Votre partenaire commercial de confiance au Burundi"}
                </p>
              </>
            ) : (
              <>
                <h1 className="text-4xl md:text-6xl font-bold mb-4">TANGANYIKA BUSINESS COMPANY</h1>
                <p className="text-xl md:text-2xl max-w-2xl mx-auto">Votre partenaire commercial de confiance au Burundi</p>
              </>
            )}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Button className="bg-yellow-600 hover:bg-yellow-700 text-white" asChild>
                <Link href="/products">Découvrir nos produits</Link>
              </Button>
              <Button variant="outline" className="bg-transparent text-white border-white hover:bg-white/10" asChild>
                <Link href="/a-propos">En savoir plus</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Most Sold Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp as any}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Produits Les Plus Vendus</h2>
            <div className="w-20 h-1 bg-yellow-600 mx-auto"></div>
          </motion.div>

          {productsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-md mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              {bestsellerProducts.length > 0 ? (
                bestsellerProducts.map((product) => (
                  <ProductCard
                    key={`bestseller-${product.id}`}
                    product={product}
                    image={product.image || "/placeholder.svg?height=300&width=400"}
                    variants={fadeInUp as any}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-6">
                  <p>Aucun produit top vente disponible</p>
                </div>
              )}
            </motion.div>
          )}

          {productsError && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">Affichage des produits par défaut</p>
            </div>
          )}
        </div>
      </section>

      {/* New Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nouveaux Produits</h2>
            <div className="w-20 h-1 bg-yellow-600 mx-auto"></div>
          </motion.div>

          {productsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-md mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
            >
              {newProducts.length > 0 ? (
                newProducts.map((product) => (
                  <ProductCard
                    key={`new-${product.id}`}
                    product={product}
                    image={product.image || "/placeholder.svg?height=300&width=400"}
                    variants={fadeInUp as any}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-6">
                  <p>Aucun nouveau produit disponible</p>
                </div>
              )}
            </motion.div>
          )}

          {productsError && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-500">Affichage des produits par défaut</p>
            </div>
          )}
        </div>
      </section>

      {/* About Section - Now Dynamic */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Image */}
            <motion.div
              className="lg:w-1/2"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {aboutLoading ? (
                <div className="rounded-lg aspect-video bg-gray-200 animate-pulse" />
              ) : (
                <Image
                  src={aboutContent?.imageUrl || "/placeholder.svg?height=600&width=800"}
                  alt="Tanganyika Business Company"
                  width={800}
                  height={600}
                  className="rounded-lg shadow-xl"
                />
              )}
            </motion.div>

            {/* Content */}
            <motion.div
              className="lg:w-1/2"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {aboutLoading ? (
                <div className="space-y-4">
                  <div className="h-8 bg-gray-200 rounded w-1/2 animate-pulse"/>
                  <div className="h-1 bg-gray-200 rounded w-20 animate-pulse"/>
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse"/>
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse"/>
                  <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"/>
                </div>
              ) : (
                <>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    {aboutContent?.title || "À Propos de Nous"}
                  </h2>
                  <div className="w-20 h-1 bg-yellow-600 mb-6"></div>
                  <div className="text-gray-700 mb-8 whitespace-pre-line">
                    {aboutContent?.content ? (
                      <p>{aboutContent.content}</p>
                    ) : (
                      <>
                        <p className="mb-6">
                          Tanganyika Business Company est une entreprise leader au Burundi, spécialisée dans la vente de produits
                          de qualité. Depuis notre création, nous nous efforçons de fournir les meilleurs produits à nos clients
                          avec un service exceptionnel.
                        </p>
                        <p>
                          Notre magasin situé à Bujumbura offre une large gamme de produits pour répondre à tous vos besoins. Nous
                          travaillons avec des fournisseurs de confiance pour garantir la qualité de tous nos articles.
                        </p>
                      </>
                    )}
                  </div>
                </>
              )}
              <Button asChild>
                <Link href="/a-propos">En savoir plus</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <SiteFooter/>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/placeholder.svg?height=40&width=40"
                  alt="Tanganyika Business Company Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
                <span className="font-bold">TANGANYIKA BUSINESS COMPANY</span>
              </Link>
            </div>
            <div className="text-center md:text-right">
              <p>© {new Date().getFullYear()} Tanganyika Business Company. Tous droits réservés.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}