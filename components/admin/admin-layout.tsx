"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Package,
  ImageIcon,
  Users,
  FileText,
  ShoppingCart,
  BarChart,
  LogOut,
  Menu,
  X,
  Heart,
  HelpCircle,
  Phone,
  UserCog,
  Video,
} from "lucide-react"
// Add import for the custom Milestone icon
import { Milestone } from "@/components/icons/milestone-icon"

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navigation = [
    { name: "Tableau de bord", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Produits", href: "/admin/products", icon: Package },
    { name: "Carousel", href: "/admin/carousel", icon: ImageIcon },
    { name: "Publicité", href: "/admin/publicite", icon: Video },
    { name: "Équipe", href: "/admin/team", icon: Users },
    { name: "À Propos", href: "/admin/about", icon: FileText },
    { name: "Valeurs", href: "/admin/values", icon: Heart },
    { name: "Jalons", href: "/admin/milestones", icon: Milestone },
    { name: "FAQ", href: "/admin/faq", icon: HelpCircle },
    { name: "Contact", href: "/admin/contact", icon: Phone },
    // { name: "Commandes", href: "/admin/orders", icon: ShoppingCart },
    // { name: "Statistiques", href: "/admin/statistics", icon: BarChart },
    // { name: "Utilisateurs", href: "/admin/users", icon: UserCog },
    { name: "Espaces", href: "/admin/espaces", icon: UserCog },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar */}
      <div className="lg:hidden">
        <div className="fixed inset-0 z-40 flex">
          {/* Sidebar backdrop */}
          {sidebarOpen && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
          )}

          {/* Sidebar */}
          <div
            className={`fixed inset-y-0 left-0 flex w-64 flex-col bg-white transition-transform duration-300 ease-in-out ${
              sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex items-center justify-between h-16 px-4 border-b">
              <Link href="/admin/dashboard" className="flex items-center">
                <Image
                  src="/placeholder.svg?height=40&width=40"
                  alt="Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
                <span className="ml-2 font-semibold">Admin Panel</span>
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 px-3">
              <nav className="space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                        isActive ? "bg-yellow-50 text-yellow-600" : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <item.icon className={`mr-3 h-5 w-5 ${isActive ? "text-yellow-600" : "text-gray-500"}`} />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
            </div>

            <div className="border-t p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-yellow-600 flex items-center justify-center text-white">
                    {user?.name.charAt(0)}
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                className="mt-3 w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={logout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r">
          <div className="flex items-center h-16 px-4 border-b">
            <Link href="/admin/dashboard" className="flex items-center">
              <Image
                src="/placeholder.svg?height=40&width=40"
                alt="Logo"
                width={40}
                height={40}
                className="object-contain"
              />
              <span className="ml-2 font-semibold">Admin Panel</span>
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto py-4 px-3">
            <nav className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      isActive ? "bg-yellow-50 text-yellow-600" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <item.icon className={`mr-3 h-5 w-5 ${isActive ? "text-yellow-600" : "text-gray-500"}`} />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="border-t p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 rounded-full bg-yellow-600 flex items-center justify-center text-white">
                  {user?.name.charAt(0)}
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              className="mt-3 w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <div className="sticky top-0 z-10 flex h-16 bg-white border-b lg:hidden">
          <Button variant="ghost" size="icon" className="px-4" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </Button>
          <div className="flex items-center px-4">
            <Image
              src="/placeholder.svg?height=32&width=32"
              alt="Logo"
              width={32}
              height={32}
              className="object-contain"
            />
            <span className="ml-2 font-semibold">Admin Panel</span>
          </div>
        </div>

        <main className="min-h-screen">{children}</main>
      </div>
    </div>
  )
}
