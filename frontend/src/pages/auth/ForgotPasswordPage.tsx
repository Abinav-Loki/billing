import * as React from "react"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Heart, Mail, CheckCircle, ArrowLeft } from "lucide-react"

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
})

type ForgotForm = z.infer<typeof schema>

export function ForgotPasswordPage() {
  const [isSent, setIsSent] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotForm>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: ForgotForm) => {
    setIsLoading(true)
    // Mock API
    await new Promise((resolve) => setTimeout(resolve, 800))
    setIsLoading(false)
    setIsSent(true)
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      <div className="w-full max-w-md p-8 bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-xl space-y-6">
        <div className="flex flex-col items-center text-center">
          <div className="bg-primary/10 p-3 rounded-full text-primary mb-3">
            <Heart className="h-8 w-8 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Reset Password</h1>
          <p className="text-sm text-muted-foreground mt-1">Enter your email to receive recovery instructions</p>
        </div>

        {isSent ? (
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-2 p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 rounded-lg border border-emerald-100 dark:border-emerald-900/50 text-center">
              <CheckCircle className="h-8 w-8 text-emerald-500" />
              <p className="font-semibold text-sm">Reset Link Sent</p>
              <p className="text-xs text-muted-foreground">Please check your inbox. We've sent instructions to reset your password.</p>
            </div>
            <Link to="/reset-password">
              <Button variant="outline" className="w-full flex items-center justify-center gap-2 mt-2">
                <span>Go to Reset Screen (Demo)</span>
              </Button>
            </Link>
          </div>
        ) : (
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

            <Button type="submit" className="w-full h-10" disabled={isLoading}>
              {isLoading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              ) : (
                "Send Password Reset Link"
              )}
            </Button>
          </form>
        )}

        <div className="text-center pt-2">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
export default ForgotPasswordPage
