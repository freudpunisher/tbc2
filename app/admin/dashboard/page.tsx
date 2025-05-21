"use client"

import { DashboardLayout } from "@/components/admin/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingBag, Users, ImageIcon, HelpCircle } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  // Fake statistics
  const stats = [
    {
      title: "Produits",
      value: "24",
      icon: <ShoppingBag className="h-8 w-8 text-yellow-600" />,
      href: "/admin/products",
    },
    {
      title: "Membres d'équipe",
      value: "4",
      icon: <Users className="h-8 w-8 text-yellow-600" />,
      href: "/admin/team",
    },
    {
      title: "Images Carousel",
      value: "3",
      icon: <ImageIcon className="h-8 w-8 text-yellow-600" />,
      href: "/admin/carousel",
    },
    {
      title: "FAQ",
      value: "4",
      icon: <HelpCircle className="h-8 w-8 text-yellow-600" />,
      href: "/admin/faq",
    },
  ]

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Link href={stat.href} key={index}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">{stat.title}</CardTitle>
                {stat.icon}
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Activité récente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-yellow-600 pl-4 py-1">
                <p className="font-medium">Nouveau produit ajouté</p>
                <p className="text-sm text-gray-500">Il y a 2 heures</p>
              </div>
              <div className="border-l-4 border-yellow-600 pl-4 py-1">
                <p className="font-medium">Image carousel mise à jour</p>
                <p className="text-sm text-gray-500">Il y a 1 jour</p>
              </div>
              <div className="border-l-4 border-yellow-600 pl-4 py-1">
                <p className="font-medium">FAQ mise à jour</p>
                <p className="text-sm text-gray-500">Il y a 3 jours</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/admin/products/new">
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <ShoppingBag className="h-8 w-8 text-yellow-600 mb-2" />
                    <p className="text-center font-medium">Ajouter un produit</p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/admin/carousel/new">
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <ImageIcon className="h-8 w-8 text-yellow-600 mb-2" />
                    <p className="text-center font-medium">Ajouter une image</p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/admin/team/new">
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <Users className="h-8 w-8 text-yellow-600 mb-2" />
                    <p className="text-center font-medium">Ajouter un membre</p>
                  </CardContent>
                </Card>
              </Link>
              <Link href="/admin/faq/new">
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <HelpCircle className="h-8 w-8 text-yellow-600 mb-2" />
                    <p className="text-center font-medium">Ajouter une FAQ</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
