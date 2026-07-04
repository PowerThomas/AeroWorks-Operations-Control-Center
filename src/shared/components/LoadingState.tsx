import { Skeleton } from "@/components/ui/skeleton"

interface LoadingStateProps {
  label?: string
}

export function LoadingState({ label = "Loading…" }: LoadingStateProps) {
  return (
    <div role="status" aria-label={label} className="space-y-3 py-6">
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <span className="sr-only">{label}</span>
    </div>
  )
}
