import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ErrorState } from "@/shared/components/ErrorState"
import { LoadingState } from "@/shared/components/LoadingState"
import { useDashboardSummary } from "../hooks/useDashboardSummary"

interface KpiCardProps {
  label: string
  value: number
}

function KpiCard({ label, value }: KpiCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  )
}

export function DashboardPage() {
  const { summary, isPending, isError, refetch } = useDashboardSummary(new Date())

  return (
    <section className="space-y-4 p-6">
      <h1 className="text-2xl font-semibold tracking-tight">Operations dashboard</h1>
      {isPending ? (
        <LoadingState label="Loading dashboard…" />
      ) : isError || !summary ? (
        <ErrorState
          title="Could not load the dashboard"
          message="One or more KPI sources failed to load."
          onRetry={refetch}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <KpiCard label="Total assets" value={summary.totalAssets} />
          <KpiCard label="Assets in critical health" value={summary.criticalAssets} />
          <KpiCard label="Overdue inspections" value={summary.overdueInspections} />
          <KpiCard label="Active incidents" value={summary.activeIncidents} />
          <KpiCard label="Open work orders" value={summary.openWorkOrders} />
          <KpiCard label="Pending exceptions" value={summary.pendingExceptions} />
        </div>
      )}
    </section>
  )
}
