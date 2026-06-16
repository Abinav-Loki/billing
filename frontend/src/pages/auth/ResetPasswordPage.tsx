import * as React from "react"
import { useNavigate, Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Heart, Lock, CheckCircle, ArrowLeft } from "lucide-react"

const schema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

type ResetForm = z.infer<typeof schema>

export function ResetPasswordPage() {
  const [isDone, setIsDone] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetForm>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: ResetForm) => {
    setIsLoading(true)
    // Mock API
    await new Promise((resolve) => setTimeout(resolve, 800))
    setIsLoading(false)
    setIsDone(true)
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      <div className="w-full max-w-md p-8 bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-850 shadow-xl space-y-6">
        <div className="flex flex-col items-center text-center">
          <div className="bg-primary/10 p-3 rounded-full text-primary mb-3">
            <Heart className="h-8 w-8 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">Set New Password</h1>
          <p className="text-sm text-muted-foreground mt-1">Please enter your new security password credentials</p>
        </div>

        {isDone ? (
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-2 p-4 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 rounded-lg border border-emerald-100 dark:border-emerald-900/50 text-center">
              <CheckCircle className="h-8 w-8 text-emerald-500" />
              <p className="font-semibold text-sm">Success</p>
              <p className="text-xs text-muted-foreground">Your password has been successfully updated.</p>
            </div>
            <Link to="/login" className="block w-full">
              <Button className="w-full">Sign In with New Password</Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">New Password</label>
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

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Confirm Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-slate-400">
                  <Lock className="h-4 w-4" />
                </span>
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="pl-9"
                  error={errors.confirmPassword?.message}
                  {...register("confirmPassword")}
                />
              </div>
            </div>

            <Button type="submit" className="w-full h-10" disabled={isLoading}>
              {isLoading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              ) : (
                "Update Password"
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
export default ResetPasswordPage
