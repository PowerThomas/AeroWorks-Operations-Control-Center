import { delay } from "@/shared/utils/delay"
import type { Incident } from "../domain/incident"
import type { IncidentRepository } from "./IncidentRepository"
import { mockIncidents } from "./mockIncidents"

/** Async, promise-based mock implementation backed by a typed in-memory dataset. */
export class MockIncidentRepository implements IncidentRepository {
  private readonly incidents: Incident[]
  private readonly latencyMs: number

  constructor(incidents: Incident[] = mockIncidents, latencyMs: number = 300) {
    this.incidents = incidents
    this.latencyMs = latencyMs
  }

  async listIncidents(): Promise<Incident[]> {
    await delay(this.latencyMs)
    return [...this.incidents]
  }

  async getIncident(id: string): Promise<Incident | undefined> {
    await delay(this.latencyMs)
    return this.incidents.find((incident) => incident.id === id)
  }
}

let defaultRepository: IncidentRepository | undefined

/** Factory returning the app-wide default IncidentRepository (mock in Phase 1). */
export function getIncidentRepository(): IncidentRepository {
  defaultRepository ??= new MockIncidentRepository()
  return defaultRepository
}
