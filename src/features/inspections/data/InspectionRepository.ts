import type { Inspection } from "../domain/inspection"

/**
 * Repository interface for inspections (future `aw_inspection`).
 */
export interface InspectionRepository {
  listInspections(): Promise<Inspection[]>
  getInspection(id: string): Promise<Inspection | undefined>
}
