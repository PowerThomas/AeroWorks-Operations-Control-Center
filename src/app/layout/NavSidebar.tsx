import { NavLink } from "react-router-dom"
import {
  ClipboardCheck,
  LayoutDashboard,
  Plane,
  Settings,
  ShieldAlert,
  Siren,
  Wrench,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  to: string
  label: string
  icon: typeof LayoutDashboard
}

const navItems: NavItem[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/assets", label: "Assets", icon: Plane },
  { to: "/inspections", label: "Inspections", icon: ClipboardCheck },
  { to: "/incidents", label: "Incidents", icon: Siren },
  { to: "/work-orders", label: "Work orders", icon: Wrench },
  { to: "/ai-triage", label: "AI triage", icon: ShieldAlert },
  { to: "/admin", label: "Admin", icon: Settings },
]

export function NavSidebar() {
  return (
    <aside className="w-56 shrink-0 border-r">
      <div className="px-4 py-5">
        <p className="text-sm font-semibold tracking-tight">AeroWorks</p>
        <p className="text-xs text-muted-foreground">Operations Control Center</p>
      </div>
      <nav aria-label="Main navigation" className="flex flex-col gap-1 px-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground",
                isActive && "bg-accent font-medium text-foreground",
              )
            }
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
