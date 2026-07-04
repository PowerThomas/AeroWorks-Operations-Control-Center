import { describe, expect, it } from "vitest"
import { isWorkOrderOpen, rankWorkOrders, type WorkOrder } from "./workOrder"

const NOW = new Date("2026-07-04T12:00:00Z")

function makeWorkOrder(overrides: Partial<WorkOrder> = {}): WorkOrder {
  return {
    id: "wo-1",
    title: "Replace drive belt",
    workOrderType: "Corrective",
    priority: "Medium",
    status: "Open",
    assetId: "asset-1",
    assetName: "Baggage Carousel 3",
    dueDate: "2026-07-20",
    ...overrides,
  }
}

describe("isWorkOrderOpen", () => {
  it("returns true for open and in-progress work orders", () => {
    expect(isWorkOrderOpen(makeWorkOrder({ status: "Open" }))).toBe(true)
    expect(isWorkOrderOpen(makeWorkOrder({ status: "InProgress" }))).toBe(true)
  })

  it("returns false for completed and cancelled work orders", () => {
    expect(isWorkOrderOpen(makeWorkOrder({ status: "Completed" }))).toBe(false)
    expect(isWorkOrderOpen(makeWorkOrder({ status: "Cancelled" }))).toBe(false)
  })
})

describe("rankWorkOrders", () => {
  it("places overdue open work orders before non-overdue ones regardless of priority", () => {
    const ranked = rankWorkOrders(
      [
        makeWorkOrder({ id: "future-critical", priority: "Critical", dueDate: "2026-07-10" }),
        makeWorkOrder({ id: "overdue-low", priority: "Low", dueDate: "2026-06-01" }),
      ],
      NOW,
    )
    expect(ranked.map((w) => w.id)).toEqual(["overdue-low", "future-critical"])
  })

  it("orders open work orders by priority, then earliest due date", () => {
    const ranked = rankWorkOrders(
      [
        makeWorkOrder({ id: "med-early", priority: "Medium", dueDate: "2026-07-08" }),
        makeWorkOrder({ id: "high", priority: "High", dueDate: "2026-07-15" }),
        makeWorkOrder({ id: "med-late", priority: "Medium", dueDate: "2026-07-12" }),
      ],
      NOW,
    )
    expect(ranked.map((w) => w.id)).toEqual(["high", "med-early", "med-late"])
  })

  it("moves completed and cancelled work orders to the end", () => {
    const ranked = rankWorkOrders(
      [
        makeWorkOrder({ id: "done", status: "Completed", priority: "Critical" }),
        makeWorkOrder({ id: "open", status: "Open", priority: "Low" }),
      ],
      NOW,
    )
    expect(ranked.map((w) => w.id)).toEqual(["open", "done"])
  })

  it("does not mutate the input array", () => {
    const input = [
      makeWorkOrder({ id: "a", priority: "Low" }),
      makeWorkOrder({ id: "b", priority: "Critical" }),
    ]
    rankWorkOrders(input, NOW)
    expect(input.map((w) => w.id)).toEqual(["a", "b"])
  })
})
