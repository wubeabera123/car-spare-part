import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonStyles = cva(
  "inline-flex items-center justify-center gap-2 font-medium transition-all focus-ring disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-accent-600 text-white hover:bg-accent-700 active:bg-accent-800 shadow-soft",
        secondary:
          "bg-brand-900 text-white hover:bg-brand-800 active:bg-brand-700",
        outline:
          "border border-border bg-transparent hover:bg-surface-muted text-foreground",
        ghost: "bg-transparent hover:bg-surface-muted text-foreground",
        link: "bg-transparent underline-offset-4 hover:underline text-brand-600 p-0 h-auto",
      },
      size: {
        sm: "h-9 rounded-md px-3 text-sm",
        md: "h-11 rounded-lg px-5 text-sm",
        lg: "h-12 rounded-lg px-6 text-base",
        icon: "h-10 w-10 rounded-lg",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonStyles> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonStyles({ variant, size }), className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";

export { buttonStyles };
