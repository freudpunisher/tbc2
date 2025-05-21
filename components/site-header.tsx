"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronDown, Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { CartSheet } from "./cart/cart-sheet"

export function SiteHeader() {
  const [scrollY, setScrollY] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Prevent hydration mismatch
  if (!mounted) {
    return null
  }

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

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrollY > 50 ? "bg-white shadow-md py-2" : "bg-transparent py-4"}`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/placeholder.svg?height=50&width=50"
            alt="Tanganyika Business Company Logo"
            width={50}
            height={50}
            className="object-contain"
          />
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="font-bold text-yellow-600 hidden sm:block"
          >
            TANGANYIKA <span className="text-blue-700">BUSINESS COMPANY</span>
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <motion.div className="flex gap-8" initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.div variants={fadeInUp}>
              <Link href="/" className="font-medium hover:text-yellow-600 transition-colors">
                ACCUEIL
              </Link>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Link href="/a-propos" className="font-medium hover:text-yellow-600 transition-colors">
                A PROPOS
              </Link>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Link href="/publicite" className="font-medium hover:text-yellow-600 transition-colors">
                PUBLICITÉ
              </Link>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Link href="/espaces" className="font-medium hover:text-yellow-600 transition-colors">
                NOS BOUTIQUES
              </Link>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Link href="/products" className="font-medium hover:text-yellow-600 transition-colors">
                PRODUITS
              </Link>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Link href="/contact" className="font-medium hover:text-yellow-600 transition-colors">
                CONTACTEZ-NOUS
              </Link>
            </motion.div>
          </motion.div>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  FR <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>FR</DropdownMenuItem>
                <DropdownMenuItem>EN</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <CartSheet />
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-2 md:hidden">
          <CartSheet />

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col gap-6 mt-10">
                <Link href="/" className="text-lg font-medium hover:text-yellow-600 transition-colors">
                  ACCUEIL
                </Link>
                <Link href="/a-propos" className="text-lg font-medium hover:text-yellow-600 transition-colors">
                  A PROPOS
                </Link>
                <Link href="/publicite" className="text-lg font-medium hover:text-yellow-600 transition-colors">
                  PUBLICITÉ
                </Link>
                <Link href="/espaces" className="text-lg font-medium hover:text-yellow-600 transition-colors">
                  NOS BOUTIQUES
                </Link>
                <Link href="/products" className="text-lg font-medium hover:text-yellow-600 transition-colors">
                  PRODUITS
                </Link>
                <Link href="/contact" className="text-lg font-medium hover:text-yellow-600 transition-colors">
                  CONTACTEZ-NOUS
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="w-20 flex items-center gap-1">
                      FR <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>FR</DropdownMenuItem>
                    <DropdownMenuItem>EN</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
