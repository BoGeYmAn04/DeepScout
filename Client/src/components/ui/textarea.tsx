import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea ref={ref} className={cn("flex min-h-24 w-full resize-none border border-white/[0.09] bg-[#090a0c] px-4 py-3 text-sm text-zinc-100 outline-none placeholder:text-zinc-700 focus:border-[#83f3dc]/30 focus:ring-1 focus:ring-[#83f3dc]/10", className)} {...props} />
  ),
);
Textarea.displayName = "Textarea";
