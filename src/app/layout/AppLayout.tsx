import { Outlet } from "react-router-dom"
import { NavSidebar } from "./NavSidebar"

export function AppLayout() {
  return (
    <div className="flex min-h-dvh">
      <NavSidebar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
