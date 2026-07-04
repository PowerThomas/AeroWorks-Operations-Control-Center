import type { Criticality, RecordId } from "@/shared/types"

/** Asset category, shaped toward the future `aw_asset` choice column. */
export type AssetType =
  | "JetBridge"
  | "BaggageSystem"
  | "HvacUnit"
  | "GroundSupportEquipment"
  | "Other"

/** Operational status, shaped toward the future `aw_asset` status column. */
export type AssetStatus =
  | "Operational"
  | "Degraded"
  | "UnderMaintenance"
  | "OutOfService"

/** Derived health classification computed from status + criticality. */
export type AssetHealthStatus = "Healthy" | "AtRisk" | "Critical"

/** Operational asset, shaped toward the future `aw_asset` Dataverse table. */
export interface Asset {
  id: RecordId
  name: string
  assetType: AssetType
  status: AssetStatus
  criticality: Criticality
  /** Lookup to `aw_operationalzone`. */
  zoneId: RecordId
  zoneName: string
  /** ISO date of the most recent completed inspection, if any. */
  lastInspectionDate?: string
}

/**
 * Computes the derived health status of an asset from its operational
 * status and criticality.
 *
 * - Out-of-service assets are always Critical.
 * - Degraded or under-maintenance assets are Critical when the asset itself
 *   is High/Critical criticality, otherwise AtRisk.
 * - Operational assets are Healthy.
 */
export function computeAssetHealthStatus(asset: Asset): AssetHealthStatus {
  if (asset.status === "OutOfService") {
    return "Critical"
  }
  if (asset.status === "Degraded" || asset.status === "UnderMaintenance") {
    return asset.criticality === "High" || asset.criticality === "Critical"
      ? "Critical"
      : "AtRisk"
  }
  return "Healthy"
}
