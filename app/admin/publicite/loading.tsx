import { AdminLayout } from "@/components/admin/admin-layout"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PubliciteLoading() {
  return (
    <AdminLayout>
      <div className="p-6">
        <Skeleton className="h-8 w-64 mb-6" />

        <Tabs defaultValue="promotional">
          <TabsList className="mb-6">
            <TabsTrigger value="promotional">Vidéo Promotionnelle</TabsTrigger>
            <TabsTrigger value="workplace">Notre Travail</TabsTrigger>
          </TabsList>

          <TabsContent value="promotional">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>
                    <Skeleton className="h-6 w-48" />
                  </CardTitle>
                  <Skeleton className="h-10 w-28" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <Skeleton className="h-6 w-64 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </div>

                  <Skeleton className="h-64 w-full" />

                  <div className="flex items-center">
                    <Skeleton className="h-4 w-16 mr-2" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  )
}
