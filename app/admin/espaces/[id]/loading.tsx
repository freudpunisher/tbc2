import { AdminLayout } from "@/components/admin/admin-layout"
import { Loader2 } from "lucide-react"

export default function ShopEditLoading() {
  return (
    <AdminLayout>
      <div className="p-6 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">Chargement des détails de la boutique...</p>
        </div>
      </div>
    </AdminLayout>
  )
}
