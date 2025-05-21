import type React from "react"
import { AuthProvider } from "@/context/auth-context"
import type { Metadata } from "next"
import { Toaster } from 'sonner'
export const metadata: Metadata = {
  title: "Admin - Tanganyika Business Company",
  description: "Panneau d'administration",
}

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <AuthProvider>
    {children}
    <Toaster />
    </AuthProvider>
}
