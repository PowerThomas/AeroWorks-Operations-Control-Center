import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { EmptyState } from "@/shared/components/EmptyState"
import { ErrorState } from "@/shared/components/ErrorState"
import { LoadingState } from "@/shared/components/LoadingState"
import { formatDate } from "@/shared/utils/dates"
import { sortIncidentsForReview, type IncidentSeverity } from "../domain/incident"
import { useIncidents } from "../hooks/useIncidents"

const severityVariant: Record<IncidentSeverity, "outline" | "secondary" | "default" | "destructive"> = {
  Low: "outline",
  Medium: "secondary",
  High: "default",
  Critical: "destructive",
}

export function IncidentsPage() {
  const { data: incidents, isPending, isError, refetch } = useIncidents()

  return (
    <section className="space-y-4 p-6">
      <h1 className="text-2xl font-semibold tracking-tight">Incidents</h1>
      {isPending ? (
        <LoadingState label="Loading incidents…" />
      ) : isError ? (
        <ErrorState
          title="Could not load incidents"
          message="The incident list failed to load."
          onRetry={() => void refetch()}
        />
      ) : incidents.length === 0 ? (
        <EmptyState title="No incidents" message="No incidents have been reported." />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Asset</TableHead>
              <TableHead>Zone</TableHead>
              <TableHead>Reported</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortIncidentsForReview(incidents).map((incident) => (
              <TableRow key={incident.id}>
                <TableCell className="font-medium">{incident.title}</TableCell>
                <TableCell>
                  <Badge variant={severityVariant[incident.severity]}>{incident.severity}</Badge>
                </TableCell>
                <TableCell>{incident.status}</TableCell>
                <TableCell>{incident.assetName ?? "—"}</TableCell>
                <TableCell>{incident.zoneName}</TableCell>
                <TableCell>{formatDate(incident.reportedAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </section>
  )
}
