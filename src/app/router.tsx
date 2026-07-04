import { createBrowserRouter } from "react-router-dom"
import { AppLayout } from "@/app/layout/AppLayout"
import { AdminPage } from "@/features/admin/ui/AdminPage"
import { AiTriagePage } from "@/features/aiTriage/ui/AiTriagePage"
import { AssetsPage } from "@/features/assets/ui/AssetsPage"
import { DashboardPage } from "@/features/dashboard/ui/DashboardPage"
import { IncidentsPage } from "@/features/incidents/ui/IncidentsPage"
import { InspectionsPage } from "@/features/inspections/ui/InspectionsPage"
import { NotFoundPage } from "@/features/notFound/ui/NotFoundPage"
import { WorkOrdersPage } from "@/features/workOrders/ui/WorkOrdersPage"

// IMPORTANT: Do not remove or modify the code below!
// Normalize basename when hosted in Power Apps
const BASENAME = new URL(".", location.href).pathname
if (location.pathname.endsWith("/index.html")) {
  history.replaceState(null, "", BASENAME + location.search + location.hash)
}

export const routes = [
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "assets", element: <AssetsPage /> },
      { path: "inspections", element: <InspectionsPage /> },
      { path: "incidents", element: <IncidentsPage /> },
      { path: "work-orders", element: <WorkOrdersPage /> },
      { path: "ai-triage", element: <AiTriagePage /> },
      { path: "admin", element: <AdminPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]

export const router = createBrowserRouter(routes, {
  basename: BASENAME, // IMPORTANT: Set basename for proper routing when hosted in Power Apps
})
