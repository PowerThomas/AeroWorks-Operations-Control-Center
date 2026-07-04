import { useQuery } from "@tanstack/react-query"
import { getWorkOrderRepository } from "../data/MockWorkOrderRepository"

export function useWorkOrders() {
  const repository = getWorkOrderRepository()
  return useQuery({
    queryKey: ["workOrders"],
    queryFn: () => repository.listWorkOrders(),
  })
}

export function useWorkOrder(id: string) {
  const repository = getWorkOrderRepository()
  return useQuery({
    queryKey: ["workOrders", id],
    queryFn: () => repository.getWorkOrder(id),
  })
}
