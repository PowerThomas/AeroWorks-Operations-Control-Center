import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

/** Static in Phase 1 — settings become `aw_setting`-driven in Phase 3. */
export function AdminPage() {
  return (
    <section className="space-y-4 p-6">
      <h1 className="text-2xl font-semibold tracking-tight">Admin</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">App settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>Environment: Local development (Phase 1 — mock data only)</p>
          <p>Data source: In-memory mock repositories</p>
          <p>
            Settings management becomes available in Phase 3, backed by the{" "}
            <code className="text-foreground">aw_setting</code> Dataverse table.
          </p>
        </CardContent>
      </Card>
    </section>
  )
}
