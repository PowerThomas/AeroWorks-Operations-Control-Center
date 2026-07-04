/**
 * Cross-feature shared types.
 *
 * These types are intentionally shaped toward the future Dataverse `aw_*`
 * data model so that the Phase 3 mock → Dataverse swap is a data-layer
 * change only.
 */

/** Identifier type used across all `aw_*`-shaped records (GUID in Dataverse). */
export type RecordId = string

/** Criticality/severity scale shared by assets, incidents, and exceptions. */
export type Criticality = "Low" | "Medium" | "High" | "Critical"

/** Reference to an operational zone (future `aw_operationalzone`). */
export interface OperationalZoneRef {
  id: RecordId
  name: string
}
