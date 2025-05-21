"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import Image from "next/image"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login, isLoading } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const success = await login(email, password)
      if (success) {
        router.push("/admin/dashboard")
      } else {
        setError("Email ou mot de passe incorrect")
      }
    } catch (err) {
      setError("Une erreur s'est produite. Veuillez réessayer.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/placeholder.svg?height=60&width=60"
            alt="Tanganyika Business Company Logo"
            width={60}
            height={60}
            className="mb-2"
          />
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <p className="text-gray-600 text-sm">Connectez-vous pour gérer votre contenu</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Connexion en cours..." : "Se connecter"}
          </Button>

          <div className="text-center text-sm text-gray-500 mt-4">
            <p>Utilisez les identifiants suivants pour tester:</p>
            <p>Email: admin@tanganyika.com</p>
            <p>Mot de passe: admin123</p>
          </div>
        </form>
      </div>
    </div>
  )
}
