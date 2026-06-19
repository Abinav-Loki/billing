import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-95 duration-150",
  {
    variants: {
      variant: {
        default:
          "bg-primary/90 backdrop-blur-sm text-primary-foreground shadow-[0_0_15px_rgba(45,190,165,0.2)] hover:bg-primary hover:shadow-[0_0_20px_rgba(45,190,165,0.4)] hover:-translate-y-0.5",
        destructive:
          "bg-destructive/90 backdrop-blur-sm text-destructive-foreground shadow-sm hover:bg-destructive hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:-translate-y-0.5",
        outline:
          "border border-input/40 bg-background/50 backdrop-blur-sm shadow-sm hover:bg-accent/80 hover:text-accent-foreground hover:border-accent hover:-translate-y-0.5",
        secondary:
          "bg-secondary/80 backdrop-blur-sm text-secondary-foreground shadow-sm hover:bg-secondary hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:-translate-y-0.5",
        ghost: "hover:bg-accent/50 hover:text-accent-foreground transition-all",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
