import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { render, screen } from "@testing-library/react"
import { RouterProvider, createMemoryRouter } from "react-router-dom"
import { describe, expect, it } from "vitest"
import { routes } from "./router"

function renderAt(path: string) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
}

describe("router", () => {
  it("renders the not-found page for unknown routes inside the app layout", () => {
    renderAt("/this-route-does-not-exist")
    expect(screen.getByText("404 – Not found")).toBeInTheDocument()
    expect(screen.getByRole("navigation", { name: "Main navigation" })).toBeInTheDocument()
  })

  it("renders the admin page at /admin", () => {
    renderAt("/admin")
    expect(screen.getByRole("heading", { name: "Admin" })).toBeInTheDocument()
  })
})
