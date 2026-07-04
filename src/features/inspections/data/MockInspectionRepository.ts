import { delay } from "@/shared/utils/delay"
import type { Inspection } from "../domain/inspection"
import type { InspectionRepository } from "./InspectionRepository"
import { mockInspections } from "./mockInspections"

/** Async, promise-based mock implementation backed by a typed in-memory dataset. */
export class MockInspectionRepository implements InspectionRepository {
  private readonly inspections: Inspection[]
  private readonly latencyMs: number

  constructor(inspections: Inspection[] = mockInspections, latencyMs: number = 300) {
    this.inspections = inspections
    this.latencyMs = latencyMs
  }

  async listInspections(): Promise<Inspection[]> {
    await delay(this.latencyMs)
    return [...this.inspections]
  }

  async getInspection(id: string): Promise<Inspection | undefined> {
    await delay(this.latencyMs)
    return this.inspections.find((inspection) => inspection.id === id)
  }
}

let defaultRepository: InspectionRepository | undefined

/** Factory returning the app-wide default InspectionRepository (mock in Phase 1). */
export function getInspectionRepository(): InspectionRepository {
  defaultRepository ??= new MockInspectionRepository()
  return defaultRepository
}
