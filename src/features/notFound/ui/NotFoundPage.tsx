import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export function NotFoundPage() {
  return (
    <div className="grid min-h-full place-items-center py-20">
      <div className="flex w-full max-w-7xl flex-col items-center space-y-6 px-8 text-center">
        <h1 className="text-5xl leading-tight tracking-tight">404 – Not found</h1>
        <p className="text-muted-foreground">This isn't the page you're looking for.</p>
        <Button variant="outline" asChild>
          <Link to="/">Go to dashboard</Link>
        </Button>
      </div>
    </div>
  )
}
