import { Inbox } from "lucide-react"

interface EmptyStateProps {
  title?: string
  message?: string
}

export function EmptyState({
  title = "Nothing here yet",
  message = "There is no data to display.",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-10 text-center">
      <Inbox className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
