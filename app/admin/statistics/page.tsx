"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, LineChart, PieChart, DollarSign, ShoppingCart, Users, TrendingUp } from "lucide-react"

export default function StatisticsPage() {
  const [mounted, setMounted] = useState(false)
  const [timeRange, setTimeRange] = useState("month")

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Statistiques</h1>
          <div className="w-48">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">7 derniers jours</SelectItem>
                <SelectItem value="month">30 derniers jours</SelectItem>
                <SelectItem value="quarter">3 derniers mois</SelectItem>
                <SelectItem value="year">Année en cours</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Ventes totales</p>
                  <p className="text-3xl font-bold">$12,345</p>
                  <p className="text-sm text-green-600 mt-1">+12.5% vs période précédente</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <DollarSign className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Commandes</p>
                  <p className="text-3xl font-bold">142</p>
                  <p className="text-sm text-green-600 mt-1">+8.2% vs période précédente</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <ShoppingCart className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Nouveaux clients</p>
                  <p className="text-3xl font-bold">64</p>
                  <p className="text-sm text-green-600 mt-1">+5.3% vs période précédente</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Taux de conversion</p>
                  <p className="text-3xl font-bold">3.2%</p>
                  <p className="text-sm text-red-600 mt-1">-0.5% vs période précédente</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="sales" className="space-y-6">
          <TabsList>
            <TabsTrigger value="sales">Ventes</TabsTrigger>
            <TabsTrigger value="products">Produits</TabsTrigger>
            <TabsTrigger value="customers">Clients</TabsTrigger>
          </TabsList>

          <TabsContent value="sales" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Évolution des ventes</CardTitle>
                <CardDescription>Ventes totales sur la période sélectionnée</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-gray-50 rounded-md border">
                  <LineChart className="h-10 w-10 text-gray-400" />
                  <span className="ml-2 text-gray-500">Graphique d'évolution des ventes</span>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ventes par catégorie</CardTitle>
                  <CardDescription>Répartition des ventes par catégorie de produits</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-md border">
                    <PieChart className="h-10 w-10 text-gray-400" />
                    <span className="ml-2 text-gray-500">Graphique des ventes par catégorie</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ventes par région</CardTitle>
                  <CardDescription>Répartition des ventes par région géographique</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-md border">
                    <BarChart className="h-10 w-10 text-gray-400" />
                    <span className="ml-2 text-gray-500">Graphique des ventes par région</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Produits les plus vendus</CardTitle>
                <CardDescription>Top 10 des produits les plus vendus</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-gray-50 rounded-md border">
                  <BarChart className="h-10 w-10 text-gray-400" />
                  <span className="ml-2 text-gray-500">Graphique des produits les plus vendus</span>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ventes par marque</CardTitle>
                  <CardDescription>Répartition des ventes par marque</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-md border">
                    <PieChart className="h-10 w-10 text-gray-400" />
                    <span className="ml-2 text-gray-500">Graphique des ventes par marque</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Produits en rupture de stock</CardTitle>
                  <CardDescription>Produits nécessitant un réapprovisionnement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-md border">
                    <span className="text-gray-500">Aucun produit en rupture de stock</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Nouveaux clients</CardTitle>
                <CardDescription>Évolution du nombre de nouveaux clients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-gray-50 rounded-md border">
                  <LineChart className="h-10 w-10 text-gray-400" />
                  <span className="ml-2 text-gray-500">Graphique d'évolution des nouveaux clients</span>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Clients par région</CardTitle>
                  <CardDescription>Répartition des clients par région</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-md border">
                    <PieChart className="h-10 w-10 text-gray-400" />
                    <span className="ml-2 text-gray-500">Graphique des clients par région</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Fidélité des clients</CardTitle>
                  <CardDescription>Répartition des clients par nombre de commandes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center bg-gray-50 rounded-md border">
                    <BarChart className="h-10 w-10 text-gray-400" />
                    <span className="ml-2 text-gray-500">Graphique de fidélité des clients</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
