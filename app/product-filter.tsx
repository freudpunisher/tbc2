"use client"

import { useState, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"

export interface FilterState {
  categories: string[]
  priceRange: [number, number]
  brands: string[]
  sortBy: "popular" | "newest" | "price-low" | "price-high"
}

interface ProductFilterProps {
  onFilterChange: (filters: FilterState) => void
  categories: string[]
  brands: string[]
  initialFilters: FilterState
}

export function ProductFilter({ 
  onFilterChange, 
  categories = [], 
  brands = [], 
  initialFilters 
}: ProductFilterProps) {
  const [filters, setFilters] = useState<FilterState>(initialFilters || {
    categories: [],
    priceRange: [0, 100000],
    brands: [],
    sortBy: "popular",
  })

  const [priceRangeInternal, setPriceRangeInternal] = useState<[number, number]>(
    initialFilters?.priceRange || [0, 100000]
  )

  // Update filters when props change
  useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters)
      setPriceRangeInternal(initialFilters.priceRange)
    }
  }, [initialFilters])

  // Send filters to parent component when they change
  useEffect(() => {
    onFilterChange(filters)
  }, [filters, onFilterChange])

  // Handle category toggle
  const handleCategoryToggle = (category: string) => {
    setFilters((prevFilters) => {
      const newCategories = prevFilters.categories.includes(category)
        ? prevFilters.categories.filter((c) => c !== category)
        : [...prevFilters.categories, category]

      return {
        ...prevFilters,
        categories: newCategories,
      }
    })
  }

  // Handle brand toggle
  const handleBrandToggle = (brand: string) => {
    setFilters((prevFilters) => {
      const newBrands = prevFilters.brands.includes(brand)
        ? prevFilters.brands.filter((b) => b !== brand)
        : [...prevFilters.brands, brand]

      return {
        ...prevFilters,
        brands: newBrands,
      }
    })
  }

  // Handle sort by change
  const handleSortByChange = (value: "popular" | "newest" | "price-low" | "price-high") => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      sortBy: value,
    }))
  }

  // Handle price range change
  const handlePriceRangeChange = (value: number[]) => {
    setPriceRangeInternal([value[0], value[1]])
  }

  // Update filters when price range changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prevFilters) => ({
        ...prevFilters,
        priceRange: priceRangeInternal as [number, number],
      }))
    }, 300)

    return () => clearTimeout(timer)
  }, [priceRangeInternal])

  // Handle reset filters
  const handleResetFilters = () => {
    setFilters({
      categories: [],
      priceRange: [0, 100000],
      brands: [],
      sortBy: "popular",
    })
    setPriceRangeInternal([0, 100000])
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-3">Trier par</h3>
        <RadioGroup
          value={filters.sortBy}
          onValueChange={(value) => 
            handleSortByChange(value as "popular" | "newest" | "price-low" | "price-high")
          }
          className="space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="popular" id="sort-popular" />
            <Label htmlFor="sort-popular">Popularité</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="newest" id="sort-newest" />
            <Label htmlFor="sort-newest">Nouveautés</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="price-low" id="sort-price-low" />
            <Label htmlFor="sort-price-low">Prix croissant</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="price-high" id="sort-price-high" />
            <Label htmlFor="sort-price-high">Prix décroissant</Label>
          </div>
        </RadioGroup>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-medium mb-3">Prix</h3>
        <div className="space-y-6">
          <Slider
            defaultValue={[0, 100000]}
            value={priceRangeInternal}
            min={0}
            max={100000}
            step={1000}
            onValueChange={handlePriceRangeChange}
            className="mt-2"
          />
          <div className="flex justify-between items-center">
            <span>{priceRangeInternal[0].toLocaleString()} €</span>
            <span>{priceRangeInternal[1].toLocaleString()} €</span>
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-medium mb-3">Catégories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category}`}
                checked={filters.categories.includes(category)}
                onCheckedChange={() => handleCategoryToggle(category)}
              />
              <Label htmlFor={`category-${category}`}>{category}</Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="text-lg font-medium mb-3">Marques</h3>
        <div className="space-y-2">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={filters.brands.includes(brand)}
                onCheckedChange={() => handleBrandToggle(brand)}
              />
              <Label htmlFor={`brand-${brand}`}>{brand}</Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <button
        onClick={handleResetFilters}
        className="w-full py-2 text-sm text-gray-600 hover:text-gray-900 font-medium"
      >
        Réinitialiser les filtres
      </button>
    </div>
  )
}