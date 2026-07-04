import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { EmptyState } from "@/shared/components/EmptyState"
import { ErrorState } from "@/shared/components/ErrorState"
import { LoadingState } from "@/shared/components/LoadingState"
import { formatDate } from "@/shared/utils/dates"
import { computeAssetHealthStatus, type AssetHealthStatus } from "../domain/asset"
import { useAssets } from "../hooks/useAssets"

const healthVariant: Record<AssetHealthStatus, "default" | "secondary" | "destructive"> = {
  Healthy: "default",
  AtRisk: "secondary",
  Critical: "destructive",
}

export function AssetsPage() {
  const { data: assets, isPending, isError, refetch } = useAssets()

  return (
    <section className="space-y-4 p-6">
      <h1 className="text-2xl font-semibold tracking-tight">Assets</h1>
      {isPending ? (
        <LoadingState label="Loading assets…" />
      ) : isError ? (
        <ErrorState
          title="Could not load assets"
          message="The asset list failed to load."
          onRetry={() => void refetch()}
        />
      ) : assets.length === 0 ? (
        <EmptyState title="No assets" message="No operational assets have been registered yet." />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Zone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Health</TableHead>
              <TableHead>Last inspection</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((asset) => {
              const health = computeAssetHealthStatus(asset)
              return (
                <TableRow key={asset.id}>
                  <TableCell className="font-medium">{asset.name}</TableCell>
                  <TableCell>{asset.assetType}</TableCell>
                  <TableCell>{asset.zoneName}</TableCell>
                  <TableCell>{asset.status}</TableCell>
                  <TableCell>
                    <Badge variant={healthVariant[health]}>{health}</Badge>
                  </TableCell>
                  <TableCell>
                    {asset.lastInspectionDate ? formatDate(asset.lastInspectionDate) : "Never"}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      )}
    </section>
  )
}
