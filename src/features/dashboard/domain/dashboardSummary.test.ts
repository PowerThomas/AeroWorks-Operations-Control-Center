import { describe, expect, it } from "vitest"
import type { Asset } from "@/features/assets/domain/asset"
import type { Incident } from "@/features/incidents/domain/incident"
import type { Inspection } from "@/features/inspections/domain/inspection"
import type { TriageException } from "@/features/aiTriage/domain/triageException"
import type { WorkOrder } from "@/features/workOrders/domain/workOrder"
import { computeDashboardSummary } from "./dashboardSummary"

const NOW = new Date("2026-07-04T12:00:00Z")

const assets: Asset[] = [
  {
    id: "a1",
    name: "Healthy asset",
    assetType: "HvacUnit",
    status: "Operational",
    criticality: "Low",
    zoneId: "z1",
    zoneName: "Zone 1",
  },
  {
    id: "a2",
    name: "Critical asset",
    assetType: "JetBridge",
    status: "OutOfService",
    criticality: "High",
    zoneId: "z1",
    zoneName: "Zone 1",
  },
]

const inspections: Inspection[] = [
  {
    id: "i1",
    title: "Overdue",
    assetId: "a1",
    assetName: "Healthy asset",
    inspectionType: "Scheduled",
    status: "Scheduled",
    dueDate: "2026-06-01",
    inspector: "X",
  },
  {
    id: "i2",
    title: "Future",
    assetId: "a1",
    assetName: "Healthy asset",
    inspectionType: "Scheduled",
    status: "Scheduled",
    dueDate: "2026-08-01",
    inspector: "X",
  },
]

const incidents: Incident[] = [
  {
    id: "n1",
    title: "Active",
    description: "",
    severity: "High",
    status: "Open",
    zoneId: "z1",
    zoneName: "Zone 1",
    reportedBy: "X",
    reportedAt: "2026-07-01T00:00:00Z",
  },
  {
    id: "n2",
    title: "Closed",
    description: "",
    severity: "Low",
    status: "Closed",
    zoneId: "z1",
    zoneName: "Zone 1",
    reportedBy: "X",
    reportedAt: "2026-06-01T00:00:00Z",
  },
]

const workOrders: WorkOrder[] = [
  {
    id: "w1",
    title: "Open",
    workOrderType: "Corrective",
    priority: "High",
    status: "Open",
    assetId: "a1",
    assetName: "Healthy asset",
    dueDate: "2026-07-10",
  },
  {
    id: "w2",
    title: "Done",
    workOrderType: "Preventive",
    priority: "Low",
    status: "Completed",
    assetId: "a1",
    assetName: "Healthy asset",
    dueDate: "2026-06-10",
  },
]

const exceptions: TriageException[] = [
  {
    id: "e1",
    title: "Pending",
    justification: "",
    riskLevel: "High",
    status: "Pending",
    assetId: "a1",
    assetName: "Healthy asset",
    requestedBy: "X",
    neededByDate: "2026-07-10",
  },
  {
    id: "e2",
    title: "Approved",
    justification: "",
    riskLevel: "Low",
    status: "Approved",
    assetId: "a1",
    assetName: "Healthy asset",
    requestedBy: "X",
    neededByDate: "2026-07-10",
  },
]

describe("computeDashboardSummary", () => {
  it("computes each KPI from the corresponding records", () => {
    const summary = computeDashboardSummary(
      { assets, inspections, incidents, workOrders, exceptions },
      NOW,
    )
    expect(summary).toEqual({
      totalAssets: 2,
      criticalAssets: 1,
      overdueInspections: 1,
      activeIncidents: 1,
      openWorkOrders: 1,
      pendingExceptions: 1,
    })
  })

  it("returns zeros for empty inputs", () => {
    const summary = computeDashboardSummary(
      { assets: [], inspections: [], incidents: [], workOrders: [], exceptions: [] },
      NOW,
    )
    expect(summary).toEqual({
      totalAssets: 0,
      criticalAssets: 0,
      overdueInspections: 0,
      activeIncidents: 0,
      openWorkOrders: 0,
      pendingExceptions: 0,
    })
  })
})
