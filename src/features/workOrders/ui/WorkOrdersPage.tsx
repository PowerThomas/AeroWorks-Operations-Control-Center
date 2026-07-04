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
import { rankWorkOrders, type WorkOrderPriority } from "../domain/workOrder"
import { useWorkOrders } from "../hooks/useWorkOrders"

const priorityVariant: Record<WorkOrderPriority, "outline" | "secondary" | "default" | "destructive"> = {
  Low: "outline",
  Medium: "secondary",
  High: "default",
  Critical: "destructive",
}

export function WorkOrdersPage() {
  const { data: workOrders, isPending, isError, refetch } = useWorkOrders()
  const now = new Date()

  return (
    <section className="space-y-4 p-6">
      <h1 className="text-2xl font-semibold tracking-tight">Work orders</h1>
      {isPending ? (
        <LoadingState label="Loading work orders…" />
      ) : isError ? (
        <ErrorState
          title="Could not load work orders"
          message="The work order list failed to load."
          onRetry={() => void refetch()}
        />
      ) : workOrders.length === 0 ? (
        <EmptyState title="No work orders" message="No maintenance work has been scheduled." />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Due</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rankWorkOrders(workOrders, now).map((workOrder) => (
              <TableRow key={workOrder.id}>
                <TableCell className="font-medium">{workOrder.title}</TableCell>
                <TableCell>{workOrder.workOrderType}</TableCell>
                <TableCell>
                  <Badge variant={priorityVariant[workOrder.priority]}>{workOrder.priority}</Badge>
                </TableCell>
                <TableCell>{workOrder.status}</TableCell>
                <TableCell>{workOrder.assignee ?? "Unassigned"}</TableCell>
                <TableCell>{formatDate(workOrder.dueDate)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </section>
  )
}
