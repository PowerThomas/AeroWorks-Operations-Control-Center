import { delay } from "@/shared/utils/delay"
import type { WorkOrder } from "../domain/workOrder"
import type { WorkOrderRepository } from "./WorkOrderRepository"
import { mockWorkOrders } from "./mockWorkOrders"

/** Async, promise-based mock implementation backed by a typed in-memory dataset. */
export class MockWorkOrderRepository implements WorkOrderRepository {
  private readonly workOrders: WorkOrder[]
  private readonly latencyMs: number

  constructor(workOrders: WorkOrder[] = mockWorkOrders, latencyMs: number = 300) {
    this.workOrders = workOrders
    this.latencyMs = latencyMs
  }

  async listWorkOrders(): Promise<WorkOrder[]> {
    await delay(this.latencyMs)
    return [...this.workOrders]
  }

  async getWorkOrder(id: string): Promise<WorkOrder | undefined> {
    await delay(this.latencyMs)
    return this.workOrders.find((workOrder) => workOrder.id === id)
  }
}

let defaultRepository: WorkOrderRepository | undefined

/** Factory returning the app-wide default WorkOrderRepository (mock in Phase 1). */
export function getWorkOrderRepository(): WorkOrderRepository {
  defaultRepository ??= new MockWorkOrderRepository()
  return defaultRepository
}
