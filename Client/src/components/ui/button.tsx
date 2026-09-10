import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all outline-none disabled:pointer-events-none disabled:opacity-40 focus-visible:ring-1 focus-visible:ring-[#83f3dc]/55 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-[#ecece8] text-black hover:bg-white",
        accent: "border border-[#83f3dc]/25 bg-[#83f3dc]/[0.07] text-[#bffbef] hover:border-[#83f3dc]/45 hover:bg-[#83f3dc]/[0.1]",
        ghost: "text-zinc-500 hover:bg-white/[0.035] hover:text-zinc-200",
        outline: "border border-white/[0.10] bg-transparent text-zinc-400 hover:border-white/[0.18] hover:bg-white/[0.025] hover:text-zinc-200",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-[11px]",
        lg: "h-12 px-6 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> { asChild?: boolean; }
export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
export { buttonVariants };
