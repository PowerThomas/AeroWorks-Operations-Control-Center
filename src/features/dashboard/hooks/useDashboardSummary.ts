import { useAssets } from "@/features/assets/hooks/useAssets"
import { useIncidents } from "@/features/incidents/hooks/useIncidents"
import { useInspections } from "@/features/inspections/hooks/useInspections"
import { useTriageExceptions } from "@/features/aiTriage/hooks/useTriageExceptions"
import { useWorkOrders } from "@/features/workOrders/hooks/useWorkOrders"
import { computeDashboardSummary, type DashboardSummary } from "../domain/dashboardSummary"

export interface DashboardSummaryQuery {
  summary: DashboardSummary | undefined
  isPending: boolean
  isError: boolean
  refetch: () => void
}

/** Combines each feature's query into a single dashboard KPI summary. */
export function useDashboardSummary(now: Date): DashboardSummaryQuery {
  const assets = useAssets()
  const inspections = useInspections()
  const incidents = useIncidents()
  const workOrders = useWorkOrders()
  const exceptions = useTriageExceptions()

  const queries = [assets, inspections, incidents, workOrders, exceptions]
  const isPending = queries.some((query) => query.isPending)
  const isError = queries.some((query) => query.isError)

  const summary =
    !isPending && !isError
      ? computeDashboardSummary(
          {
            assets: assets.data ?? [],
            inspections: inspections.data ?? [],
            incidents: incidents.data ?? [],
            workOrders: workOrders.data ?? [],
            exceptions: exceptions.data ?? [],
          },
          now,
        )
      : undefined

  return {
    summary,
    isPending,
    isError,
    refetch: () => {
      queries.forEach((query) => void query.refetch())
    },
  }
}
