import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { afterEach, describe, expect, it, vi } from "vitest"
import type { Asset } from "../domain/asset"
import type { AssetRepository } from "../data/AssetRepository"
import { getAssetRepository } from "../data/MockAssetRepository"
import { AssetsPage } from "./AssetsPage"

vi.mock("../data/MockAssetRepository", () => ({
  getAssetRepository: vi.fn(),
}))

const mockedGetAssetRepository = vi.mocked(getAssetRepository)

function stubRepository(listAssets: () => Promise<Asset[]>): void {
  const repository: AssetRepository = {
    listAssets,
    getAsset: () => Promise.resolve(undefined),
  }
  mockedGetAssetRepository.mockReturnValue(repository)
}

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <AssetsPage />
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

const sampleAsset: Asset = {
  id: "asset-001",
  name: "Jet Bridge A1",
  assetType: "JetBridge",
  status: "Operational",
  criticality: "High",
  zoneId: "zone-001",
  zoneName: "Terminal 1 — Gates A",
  lastInspectionDate: "2026-06-12",
}

afterEach(() => {
  vi.resetAllMocks()
})

describe("AssetsPage", () => {
  it("shows the loading state while assets are being fetched", () => {
    stubRepository(() => new Promise<Asset[]>(() => {}))
    renderPage()
    expect(screen.getByRole("status", { name: "Loading assets…" })).toBeInTheDocument()
  })

  it("shows the error state when loading fails", async () => {
    stubRepository(() => Promise.reject(new Error("boom")))
    renderPage()
    expect(await screen.findByRole("alert")).toHaveTextContent("Could not load assets")
  })

  it("shows the empty state when there are no assets", async () => {
    stubRepository(() => Promise.resolve([]))
    renderPage()
    expect(await screen.findByText("No assets")).toBeInTheDocument()
  })

  it("shows the populated table with computed health status", async () => {
    stubRepository(() => Promise.resolve([sampleAsset]))
    renderPage()
    expect(await screen.findByText("Jet Bridge A1")).toBeInTheDocument()
    expect(screen.getByText("Healthy")).toBeInTheDocument()
  })
})
