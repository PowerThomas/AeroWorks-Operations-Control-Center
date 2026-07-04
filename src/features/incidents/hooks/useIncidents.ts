import { useQuery } from "@tanstack/react-query"
import { getIncidentRepository } from "../data/MockIncidentRepository"

export function useIncidents() {
  const repository = getIncidentRepository()
  return useQuery({
    queryKey: ["incidents"],
    queryFn: () => repository.listIncidents(),
  })
}

export function useIncident(id: string) {
  const repository = getIncidentRepository()
  return useQuery({
    queryKey: ["incidents", id],
    queryFn: () => repository.getIncident(id),
  })
}
