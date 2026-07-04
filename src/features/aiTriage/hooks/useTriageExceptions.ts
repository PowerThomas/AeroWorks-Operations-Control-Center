import { useQuery } from "@tanstack/react-query"
import { getTriageExceptionRepository } from "../data/MockTriageExceptionRepository"

export function useTriageExceptions() {
  const repository = getTriageExceptionRepository()
  return useQuery({
    queryKey: ["aiTriage"],
    queryFn: () => repository.listTriageExceptions(),
  })
}

export function useTriageException(id: string) {
  const repository = getTriageExceptionRepository()
  return useQuery({
    queryKey: ["aiTriage", id],
    queryFn: () => repository.getTriageException(id),
  })
}
