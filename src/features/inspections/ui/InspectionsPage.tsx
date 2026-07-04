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
import { isInspectionOverdue } from "../domain/inspection"
import { useInspections } from "../hooks/useInspections"

export function InspectionsPage() {
  const { data: inspections, isPending, isError, refetch } = useInspections()
  const now = new Date()

  return (
    <section className="space-y-4 p-6">
      <h1 className="text-2xl font-semibold tracking-tight">Inspections</h1>
      {isPending ? (
        <LoadingState label="Loading inspections…" />
      ) : isError ? (
        <ErrorState
          title="Could not load inspections"
          message="The inspection list failed to load."
          onRetry={() => void refetch()}
        />
      ) : inspections.length === 0 ? (
        <EmptyState title="No inspections" message="No inspections have been planned yet." />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Asset</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due</TableHead>
              <TableHead>Outcome</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inspections.map((inspection) => (
              <TableRow key={inspection.id}>
                <TableCell className="font-medium">{inspection.title}</TableCell>
                <TableCell>{inspection.assetName}</TableCell>
                <TableCell>{inspection.inspectionType}</TableCell>
                <TableCell>
                  {isInspectionOverdue(inspection, now) ? (
                    <Badge variant="destructive">Overdue</Badge>
                  ) : (
                    inspection.status
                  )}
                </TableCell>
                <TableCell>{formatDate(inspection.dueDate)}</TableCell>
                <TableCell>{inspection.outcome ?? "—"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </section>
  )
}
