import { useQuery } from "@tanstack/react-query"
import { getAssetRepository } from "../data/MockAssetRepository"

export function useAssets() {
  const repository = getAssetRepository()
  return useQuery({
    queryKey: ["assets"],
    queryFn: () => repository.listAssets(),
  })
}

export function useAsset(id: string) {
  const repository = getAssetRepository()
  return useQuery({
    queryKey: ["assets", id],
    queryFn: () => repository.getAsset(id),
  })
}
