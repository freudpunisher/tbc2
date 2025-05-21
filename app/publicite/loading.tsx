import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Loading() {
  return (
    <div className="container mx-auto py-24 px-4 mt-16">
      <div className="text-center mb-12">
        <Skeleton className="h-10 w-64 mx-auto mb-4" />
        <Skeleton className="h-6 w-full max-w-2xl mx-auto" />
      </div>

      <div className="max-w-4xl mx-auto">
        <Skeleton className="h-12 w-full mb-8" />

        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-full" />
              </div>

              <Skeleton className="aspect-video w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
