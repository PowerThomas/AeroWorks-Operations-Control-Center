import type { WorkOrder } from "../domain/workOrder"

/**
 * Repository interface for work orders (future `aw_workorder`).
 */
export interface WorkOrderRepository {
  listWorkOrders(): Promise<WorkOrder[]>
  getWorkOrder(id: string): Promise<WorkOrder | undefined>
}
