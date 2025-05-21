import { Skeleton } from "@/components/ui/skeleton"

export default function WorkspaceDetailLoading() {
  return (
    <div className="container mx-auto px-4 py-24 mt-16">
      <Skeleton className="h-6 w-32 mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Skeleton className="h-10 w-64 mb-4" />
          <Skeleton className="h-6 w-full max-w-md mb-4" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-3/4 mb-8" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-lg" />
              ))}
          </div>

          <Skeleton className="h-10 w-full mb-6" />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-lg" />
              ))}
          </div>
        </div>

        <div>
          <Skeleton className="h-64 rounded-lg mb-6" />
          <Skeleton className="h-6 w-32 mb-4" />
          <Skeleton className="h-64 rounded-lg" />
        </div>
      </div>
    </div>
  )
}
