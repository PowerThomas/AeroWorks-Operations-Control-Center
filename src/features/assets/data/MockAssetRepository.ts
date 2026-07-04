import { delay } from "@/shared/utils/delay"
import type { Asset } from "../domain/asset"
import type { AssetRepository } from "./AssetRepository"
import { mockAssets } from "./mockAssets"

/** Async, promise-based mock implementation backed by a typed in-memory dataset. */
export class MockAssetRepository implements AssetRepository {
  private readonly assets: Asset[]
  private readonly latencyMs: number

  constructor(assets: Asset[] = mockAssets, latencyMs: number = 300) {
    this.assets = assets
    this.latencyMs = latencyMs
  }

  async listAssets(): Promise<Asset[]> {
    await delay(this.latencyMs)
    return [...this.assets]
  }

  async getAsset(id: string): Promise<Asset | undefined> {
    await delay(this.latencyMs)
    return this.assets.find((asset) => asset.id === id)
  }
}

let defaultRepository: AssetRepository | undefined

/** Factory returning the app-wide default AssetRepository (mock in Phase 1). */
export function getAssetRepository(): AssetRepository {
  defaultRepository ??= new MockAssetRepository()
  return defaultRepository
}
