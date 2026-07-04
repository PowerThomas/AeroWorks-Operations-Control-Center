import { RouterProvider } from "react-router-dom"
import { QueryProvider } from "@/app/providers/QueryProvider"
import { SonnerProvider } from "@/app/providers/SonnerProvider"
import { ThemeProvider } from "@/app/providers/ThemeProvider"
import { router } from "@/app/router"

export function App() {
  return (
    <ThemeProvider>
      <SonnerProvider>
        <QueryProvider>
          <RouterProvider router={router} />
        </QueryProvider>
      </SonnerProvider>
    </ThemeProvider>
  )
}
