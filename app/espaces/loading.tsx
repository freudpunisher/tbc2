import { Skeleton } from "@/components/ui/skeleton"

export default function WorkspacesLoading() {
  return (
    <div className="container mx-auto px-4 py-24 mt-16">
      <div className="text-center mb-16">
        <Skeleton className="h-10 w-64 mx-auto mb-4" />
        <Skeleton className="h-6 w-full max-w-3xl mx-auto" />
        <Skeleton className="h-6 w-full max-w-2xl mx-auto mt-2" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="overflow-hidden rounded-lg border border-gray-200">
              <Skeleton className="h-48 w-full" />
              <div className="p-6">
                <Skeleton className="h-6 w-48 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-6" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-6" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
