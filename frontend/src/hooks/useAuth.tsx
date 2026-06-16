import * as React from "react"

export interface UserSession {
  email: string
  name: string
  role: "Admin" | "Reception"
}

interface AuthContextType {
  user: UserSession | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  error: string | null
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<UserSession | null>(() => {
    const saved = localStorage.getItem("ascas_user")
    if (saved && saved !== "null" && saved !== "undefined") {
      try {
        return JSON.parse(saved)
      } catch (e) {}
    }
    return {
      email: "admin@ascas.com",
      name: "Admin Administrator",
      role: "Admin",
    }
  })
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    if (email === "admin@ascas.com" && password === "admin123") {
      const adminUser: UserSession = {
        email,
        name: "Admin Administrator",
        role: "Admin",
      }
      setUser(adminUser)
      localStorage.setItem("ascas_user", JSON.stringify(adminUser))
      setIsLoading(false)
      return true
    }

    if (email === "reception@ascas.com" && password === "reception123") {
      const recUser: UserSession = {
        email,
        name: "Reception Desk",
        role: "Reception",
      }
      setUser(recUser)
      localStorage.setItem("ascas_user", JSON.stringify(recUser))
      setIsLoading(false)
      return true
    }

    setError("Invalid email or password. Please use correct credentials.")
    setIsLoading(false)
    return false
  }

  const logout = () => {
    // Disable logout to prevent lockout when login is bypassed
    alert("Logout is disabled because login authentication is bypassed.")
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
