import type React from "react"
import { cn } from "@/lib/utils"

interface CodeProps extends React.HTMLAttributes<HTMLPreElement> {
  children: React.ReactNode
}

export function Code({ className, children, ...props }: CodeProps) {
  return (
    <pre className={cn("px-4 py-3 font-mono text-sm bg-secondary/50 rounded-md overflow-x-auto", className)} {...props}>
      <code>{children}</code>
    </pre>
  )
}
