"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { ProtectedRoute } from "./protected-route"
import {
  LayoutDashboard,
  ShoppingBag,
  ImageIcon,
  Users,
  Clock,
  Award,
  Phone,
  HelpCircle,
  FileText,
  Menu,
  LogOut,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface NavItemProps {
  href: string
  icon: React.ReactNode
  label: string
  active?: boolean
  onClick?: () => void
}

function NavItem({ href, icon, label, active, onClick }: NavItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
        active ? "bg-yellow-100 text-yellow-700" : "hover:bg-gray-100"
      }`}
      onClick={onClick}
    >
      {icon}
      <span>{label}</span>
    </Link>
  )
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [contentExpanded, setContentExpanded] = useState(true)

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
  }

  const navItems = [
    {
      href: "/admin/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Dashboard",
    },
    {
      href: "/admin/products",
      icon: <ShoppingBag className="h-5 w-5" />,
      label: "Produits",
    },
    {
      href: "/admin/carousel",
      icon: <ImageIcon className="h-5 w-5" />,
      label: "Carousel",
    },
    {
      href: "/admin/team",
      icon: <Users className="h-5 w-5" />,
      label: "Équipe",
    },
    {
      href: "/admin/milestones",
      icon: <Clock className="h-5 w-5" />,
      label: "Parcours",
    },
    {
      href: "/admin/values",
      icon: <Award className="h-5 w-5" />,
      label: "Valeurs",
    },
    {
      href: "/admin/contact",
      icon: <Phone className="h-5 w-5" />,
      label: "Contact",
    },
    {
      href: "/admin/faq",
      icon: <HelpCircle className="h-5 w-5" />,
      label: "FAQ",
    },
    {
      href: "/admin/about",
      icon: <FileText className="h-5 w-5" />,
      label: "À Propos",
    },
  ]

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Top Navigation */}
        <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-10 h-16">
          <div className="flex items-center justify-between px-4 h-full">
            <div className="flex items-center gap-2">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                  <div className="flex flex-col h-full">
                    <div className="p-4 border-b">
                      <div className="flex items-center gap-2">
                        <Image
                          src="/placeholder.svg?height=40&width=40"
                          alt="Logo"
                          width={40}
                          height={40}
                          className="rounded-md"
                        />
                        <span className="font-semibold">Admin Panel</span>
                      </div>
                    </div>
                    <div className="flex-1 overflow-auto py-4 px-2">
                      <nav className="space-y-1">
                        {navItems.map((item) => (
                          <NavItem
                            key={item.href}
                            href={item.href}
                            icon={item.icon}
                            label={item.label}
                            active={pathname === item.href}
                            onClick={closeMobileMenu}
                          />
                        ))}
                      </nav>
                    </div>
                    <div className="p-4 border-t">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={logout}
                      >
                        <LogOut className="h-5 w-5 mr-2" />
                        Déconnexion
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <Link href="/admin/dashboard" className="flex items-center gap-2">
                <Image
                  src="/placeholder.svg?height=40&width=40"
                  alt="Logo"
                  width={40}
                  height={40}
                  className="rounded-md"
                />
                <span className="font-semibold hidden md:inline">Admin Panel</span>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600 hidden md:block">
                Connecté en tant que <span className="font-medium">{user?.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={logout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </header>

        <div className="pt-16 flex">
          {/* Sidebar Navigation */}
          <aside className="hidden md:block w-64 bg-white shadow-sm h-[calc(100vh-4rem)] fixed left-0 overflow-y-auto">
            <nav className="p-4 space-y-1">
              {navItems.map((item) => (
                <NavItem
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                  active={pathname === item.href}
                />
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 md:ml-64 p-6">
            <Collapsible open={contentExpanded} onOpenChange={setContentExpanded} className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">
                  {navItems.find((item) => item.href === pathname)?.label || "Dashboard"}
                </h1>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${contentExpanded ? "transform rotate-180" : ""}`}
                    />
                    <span className="sr-only">Toggle content</span>
                  </Button>
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent>{children}</CollapsibleContent>
            </Collapsible>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
