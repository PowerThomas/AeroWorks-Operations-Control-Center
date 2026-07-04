import type { Incident } from "../domain/incident"

/**
 * Repository interface for incidents (future `aw_incident`).
 */
export interface IncidentRepository {
  listIncidents(): Promise<Incident[]>
  getIncident(id: string): Promise<Incident | undefined>
}
