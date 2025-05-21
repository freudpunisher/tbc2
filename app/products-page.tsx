"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Filter, Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ProductFilter, type FilterState } from "./product-filter"
import { SiteHeader } from "@/components/site-header"
import { ProductCard } from "@/components/product-card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { toast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"

export default function ProductsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRange: [0, 100000], // Increased max price based on your data
    brands: [],
    sortBy: "popular",
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [allProducts, setAllProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const productsPerPage = 12

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/products')
        
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        
        const data = await response.json()
        setAllProducts(data)
        setError(null)
      } catch (err) {
        console.error('Error fetching products:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
        
        toast({
          title: "Error",
          description: "Failed to load products. Using sample data instead.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Extract unique categories and brands for filters
  const categories = [...new Set(allProducts.map((product: any) => product.category))]
  const brands = [...new Set(allProducts.map((product: any) => product.brand))]

  // Filter, search and sort products
  const filteredProducts = allProducts
    .filter((product: any) => {
      // Search filter
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
      
      // Filter by category
      if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
        return false
      }

      // Filter by price
      const productPrice = typeof product.price === 'string' 
        ? parseFloat(product.price) 
        : product.price
        
      if (productPrice < filters.priceRange[0] || productPrice > filters.priceRange[1]) {
        return false
      }

      // Filter by brand
      if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
        return false
      }

      return true
    })
    .sort((a: any, b: any) => {
      // Sort products
      const aPrice = typeof a.price === 'string' ? parseFloat(a.price) : a.price
      const bPrice = typeof b.price === 'string' ? parseFloat(b.price) : b.price
      
      switch (filters.sortBy) {
        case "newest":
          return a.isNew ? -1 : b.isNew ? 1 : 0
        case "price-low":
          return aPrice - bPrice
        case "price-high":
          return bPrice - aPrice
        case "popular":
        default:
          return a.isBestseller ? -1 : b.isBestseller ? 1 : 0
      }
    })

  // Get current page products
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)

  // Calculate total pages
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Handle filter change
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page when filters change
  }

  // Handle search query change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1) // Reset to first page when search changes
  }

  // Animation variants
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
        staggerChildren: 0.1,
      },
    },
  }

  // Get bestsellers
  const bestsellers = allProducts.filter((product: any) => product.isBestseller).slice(0, 4)

  // Get new products
  const newProducts = allProducts.filter((product: any) => product.isNew).slice(0, 4)

  return (
    <div>
      <SiteHeader />
      <div className="pt-24 pb-8">
        {/* Loading state */}
        {isLoading ? (
          <div className="container mx-auto px-4 py-16 text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-md p-4">
                    <div className="bg-gray-200 h-48 rounded-md mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Most Sold Products Section */}
            <section className="py-16 bg-gray-50">
              <div className="container mx-auto px-4">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={fadeInUp}
                  className="text-center mb-12"
                >
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Produits Les Plus Vendus</h2>
                  <div className="w-20 h-1 bg-yellow-600 mx-auto"></div>
                </motion.div>

                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={staggerContainer}
                >
                  {bestsellers.length > 0 ? (
                    bestsellers.map((product: any) => (
                      <ProductCard
                        key={`bestseller-${product.id}`}
                        product={product}
                        image={product.image || "/placeholder.svg?height=300&width=400"}
                        variants={fadeInUp}
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-6">
                      <p>Aucun produit top vente disponible</p>
                    </div>
                  )}
                </motion.div>
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

                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={staggerContainer}
                >
                  {newProducts.length > 0 ? (
                    newProducts.map((product: any) => (
                      <ProductCard
                        key={`new-${product.id}`}
                        product={product}
                        image={product.image || "/placeholder.svg?height=300&width=400"}
                        variants={fadeInUp}
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-6">
                      <p>Aucun nouveau produit disponible</p>
                    </div>
                  )}
                </motion.div>
              </div>
            </section>

            {/* All Products Section with Filters */}
            <section className="py-16 bg-gray-50">
              <div className="container mx-auto px-4">
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={fadeInUp}
                  className="text-center mb-12"
                >
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Tous Nos Produits</h2>
                  <div className="w-20 h-1 bg-yellow-600 mx-auto"></div>
                </motion.div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-6 max-w-xl mx-auto">
                    <p>Erreur lors du chargement des produits: {error}</p>
                    <p className="text-sm mt-1">Utilisation des données de démonstration comme solution de secours.</p>
                  </div>
                )}

                {/* Search bar */}
                <div className="mb-8 max-w-xl mx-auto">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Rechercher un produit..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                      className="pl-10 py-6 bg-white"
                    />
                    {searchQuery && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
                        onClick={() => setSearchQuery("")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Mobile filter button */}
                <div className="lg:hidden mb-6">
                  <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                        <Filter className="h-4 w-4" />
                        Filtres
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
                      <div className="p-4 border-b">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">Filtres</h3>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setMobileFiltersOpen(false)}
                            className="h-8 w-8"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="p-4">
                        <ProductFilter 
                          onFilterChange={handleFilterChange} 
                          categories={categories}
                          brands={brands}
                          initialFilters={filters}
                        />
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Desktop Sidebar Filter */}
                  <div className="hidden lg:block w-64 flex-shrink-0">
                    <div className="sticky top-24">
                      <ProductFilter 
                        onFilterChange={handleFilterChange} 
                        categories={categories}
                        brands={brands}
                        initialFilters={filters}
                      />
                    </div>
                  </div>

                  {/* Products Grid */}
                  <div className="flex-1">
                    <div className="mb-6">
                      <p className="text-sm text-gray-500">
                        Affichage de {Math.min(indexOfFirstProduct + 1, filteredProducts.length)} - {Math.min(indexOfLastProduct, filteredProducts.length)} sur {filteredProducts.length} produits
                      </p>
                    </div>

                    <motion.div
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, margin: "-100px" }}
                      variants={staggerContainer}
                    >
                      {currentProducts.length > 0 ? (
                        currentProducts.map((product: any) => (
                          <ProductCard
                            key={`product-${product.id}`}
                            product={product}
                            image={product.image || "/placeholder.svg?height=300&width=400"}
                            variants={fadeInUp}
                          />
                        ))
                      ) : (
                        <div className="col-span-full text-center py-12">
                          <p className="text-lg text-gray-500">Aucun produit ne correspond à vos critères de recherche.</p>
                          <Button
                            className="mt-4"
                            onClick={() => {
                              setFilters({
                                categories: [],
                                priceRange: [0, 100000],
                                brands: [],
                                sortBy: "popular",
                              });
                              setSearchQuery("");
                            }}
                          >
                            Réinitialiser les filtres
                          </Button>
                        </div>
                      )}
                    </motion.div>

                    {/* Pagination */}
                    {filteredProducts.length > 0 && (
                      <div className="mt-12 flex justify-center">
                        <div className="flex space-x-1">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>

                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            // Show pages around current page
                            let pageNum = i + 1
                            if (totalPages > 5) {
                              if (currentPage > 3) {
                                pageNum = currentPage - 3 + i
                              }
                              if (currentPage > totalPages - 2) {
                                pageNum = totalPages - 4 + i
                              }
                            }

                            return (
                              <Button
                                key={pageNum}
                                variant={currentPage === pageNum ? "default" : "outline"}
                                size="sm"
                                onClick={() => handlePageChange(pageNum)}
                              >
                                {pageNum}
                              </Button>
                            )
                          })}

                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  )
}