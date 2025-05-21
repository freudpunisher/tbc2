"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface ProductSearchInputProps {
  onSearchChange: (searchTerm: string) => void
  initialValue?: string
}

export function ProductSearchInput({ onSearchChange, initialValue = "" }: ProductSearchInputProps) {
  const [searchTerm, setSearchTerm] = useState(initialValue)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearchChange(searchTerm)
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Rechercher des produits..."
          className="pl-9 pr-16"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button 
          type="submit" 
          size="sm" 
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8"
        >
          Rechercher
        </Button>
      </div>
    </form>
  )
}