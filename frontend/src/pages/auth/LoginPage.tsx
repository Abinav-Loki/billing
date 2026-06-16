import * as React from "react"
import { useNavigate, Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useAuth } from "../../hooks/useAuth"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Heart, Lock, Mail, AlertCircle, ArrowRight } from "lucide-react"

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginForm = z.infer<typeof loginSchema>

export function LoginPage() {
  const { login, error, isLoading } = useAuth()
  const navigate = useNavigate()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginForm) => {
    const success = await login(data.email, data.password)
    if (success) {
      navigate("/")
    }
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      <div className="w-full max-w-md p-8 bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-xl space-y-6">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <div className="bg-primary/10 p-3 rounded-full text-primary mb-3">
            <Heart className="h-8 w-8 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">ASCAS Fertility & Women's Center</h1>
          <p className="text-sm text-muted-foreground mt-1">IP Billing & Administration System</p>
        </div>

        {/* Info Box */}
        <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-150 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1">
          <p className="font-semibold text-slate-800 dark:text-slate-350">Sample Credentials:</p>
          <div className="flex justify-between">
            <span>Admin: admin@ascas.com</span>
            <span className="font-mono bg-slate-200/50 dark:bg-slate-800 px-1 rounded">admin123</span>
          </div>
          <div className="flex justify-between">
            <span>Reception: reception@ascas.com</span>
            <span className="font-mono bg-slate-200/50 dark:bg-slate-800 px-1 rounded">reception123</span>
          </div>
        </div>

        {/* Errors */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive text-sm rounded-lg border border-destructive/20 animate-shake">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Email Address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                <Mail className="h-4 w-4" />
              </span>
              <Input
                type="email"
                placeholder="you@hospital.com"
                className="pl-9"
                error={errors.email?.message}
                {...register("email")}
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Password</label>
              <Link
                to="/forgot-password"
                className="text-xs text-primary hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                <Lock className="h-4 w-4" />
              </span>
              <Input
                type="password"
                placeholder="••••••••"
                className="pl-9"
                error={errors.password?.message}
                {...register("password")}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full flex justify-center items-center gap-2 mt-2 h-10"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}
export default LoginPage
