import { describe, expect, it } from "vitest"
import { computeAssetHealthStatus, type Asset } from "./asset"

function makeAsset(overrides: Partial<Asset> = {}): Asset {
  return {
    id: "asset-1",
    name: "Jet Bridge A1",
    assetType: "JetBridge",
    status: "Operational",
    criticality: "Medium",
    zoneId: "zone-1",
    zoneName: "Terminal 1",
    ...overrides,
  }
}

describe("computeAssetHealthStatus", () => {
  it("returns Healthy for operational assets regardless of criticality", () => {
    expect(computeAssetHealthStatus(makeAsset({ status: "Operational", criticality: "Critical" }))).toBe("Healthy")
    expect(computeAssetHealthStatus(makeAsset({ status: "Operational", criticality: "Low" }))).toBe("Healthy")
  })

  it("returns Critical for out-of-service assets regardless of criticality", () => {
    expect(computeAssetHealthStatus(makeAsset({ status: "OutOfService", criticality: "Low" }))).toBe("Critical")
    expect(computeAssetHealthStatus(makeAsset({ status: "OutOfService", criticality: "Critical" }))).toBe("Critical")
  })

  it("returns AtRisk for degraded assets with low or medium criticality", () => {
    expect(computeAssetHealthStatus(makeAsset({ status: "Degraded", criticality: "Low" }))).toBe("AtRisk")
    expect(computeAssetHealthStatus(makeAsset({ status: "Degraded", criticality: "Medium" }))).toBe("AtRisk")
  })

  it("returns Critical for degraded assets with high or critical criticality", () => {
    expect(computeAssetHealthStatus(makeAsset({ status: "Degraded", criticality: "High" }))).toBe("Critical")
    expect(computeAssetHealthStatus(makeAsset({ status: "Degraded", criticality: "Critical" }))).toBe("Critical")
  })

  it("treats under-maintenance assets like degraded ones", () => {
    expect(computeAssetHealthStatus(makeAsset({ status: "UnderMaintenance", criticality: "Medium" }))).toBe("AtRisk")
    expect(computeAssetHealthStatus(makeAsset({ status: "UnderMaintenance", criticality: "High" }))).toBe("Critical")
  })
})
