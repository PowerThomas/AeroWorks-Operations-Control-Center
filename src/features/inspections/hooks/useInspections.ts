import { useQuery } from "@tanstack/react-query"
import { getInspectionRepository } from "../data/MockInspectionRepository"

export function useInspections() {
  const repository = getInspectionRepository()
  return useQuery({
    queryKey: ["inspections"],
    queryFn: () => repository.listInspections(),
  })
}

export function useInspection(id: string) {
  const repository = getInspectionRepository()
  return useQuery({
    queryKey: ["inspections", id],
    queryFn: () => repository.getInspection(id),
  })
}
