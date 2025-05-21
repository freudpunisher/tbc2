"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"

// Define the User type
export interface User {
  id: string
  name: string
  email: string
  role: "admin"
}

// Define the AuthContext type
interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Fake user data
const FAKE_USER: User = {
  id: "1",
  name: "Admin User",
  email: "admin@tanganyika.com",
  role: "admin",
}

// Fake credentials
const FAKE_CREDENTIALS = {
  email: "admin@tanganyika.com",
  password: "admin123",
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check if user is already logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Failed to parse stored user", error)
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (email === FAKE_CREDENTIALS.email && password === FAKE_CREDENTIALS.password) {
      setUser(FAKE_USER)
      localStorage.setItem("user", JSON.stringify(FAKE_USER))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  // Logout function
  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/admin/login")
  }

  return <AuthContext.Provider value={{ user, isLoading, login, logout }}>{children}</AuthContext.Provider>
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
