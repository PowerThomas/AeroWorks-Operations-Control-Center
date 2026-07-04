import { describe, expect, it } from "vitest"
import { MockAssetRepository } from "./MockAssetRepository"
import { mockAssets } from "./mockAssets"

describe("MockAssetRepository", () => {
  const repository = new MockAssetRepository(mockAssets, 0)

  it("lists all assets asynchronously", async () => {
    const assets = await repository.listAssets()
    expect(assets).toHaveLength(mockAssets.length)
    expect(assets[0]).toMatchObject({ id: "asset-001", name: "Jet Bridge A1" })
  })

  it("returns a copy of the dataset, not the internal array", async () => {
    const assets = await repository.listAssets()
    expect(assets).not.toBe(mockAssets)
  })

  it("finds an asset by id", async () => {
    const asset = await repository.getAsset("asset-003")
    expect(asset?.name).toBe("Baggage Carousel 3")
  })

  it("returns undefined for an unknown id", async () => {
    const asset = await repository.getAsset("no-such-asset")
    expect(asset).toBeUndefined()
  })
})
