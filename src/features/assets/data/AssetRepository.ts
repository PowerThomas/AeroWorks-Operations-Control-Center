import type { Asset } from "../domain/asset"

/**
 * Repository interface for operational assets (future `aw_asset`).
 *
 * Phase 1: implemented by `MockAssetRepository`.
 * Phase 3: implemented by a Dataverse-backed adapter wrapping generated services.
 */
export interface AssetRepository {
  listAssets(): Promise<Asset[]>
  getAsset(id: string): Promise<Asset | undefined>
}
