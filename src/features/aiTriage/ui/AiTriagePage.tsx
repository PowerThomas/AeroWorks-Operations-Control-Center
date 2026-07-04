import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EmptyState } from "@/shared/components/EmptyState"
import { ErrorState } from "@/shared/components/ErrorState"
import { LoadingState } from "@/shared/components/LoadingState"
import { formatDate } from "@/shared/utils/dates"
import { prioritizeTriageExceptions, type TriageRiskLevel } from "../domain/triageException"
import { useTriageExceptions } from "../hooks/useTriageExceptions"

const riskVariant: Record<TriageRiskLevel, "outline" | "secondary" | "default" | "destructive"> = {
  Low: "outline",
  Medium: "secondary",
  High: "default",
  Critical: "destructive",
}

export function AiTriagePage() {
  const { data: exceptions, isPending, isError, refetch } = useTriageExceptions()
  const now = new Date()

  return (
    <section className="space-y-4 p-6">
      <h1 className="text-2xl font-semibold tracking-tight">AI triage</h1>
      <p className="text-sm text-muted-foreground">
        Pending high-risk exception requests, prioritized for review. The Copilot Studio
        triage assistant arrives in Phase 4 — this queue is powered by local prioritization
        logic until then.
      </p>
      {isPending ? (
        <LoadingState label="Loading exception requests…" />
      ) : isError ? (
        <ErrorState
          title="Could not load exception requests"
          message="The exception request queue failed to load."
          onRetry={() => void refetch()}
        />
      ) : exceptions.length === 0 ? (
        <EmptyState
          title="No exception requests"
          message="There are no high-risk exception requests to triage."
        />
      ) : (
        (() => {
          const prioritized = prioritizeTriageExceptions(exceptions, now)
          if (prioritized.length === 0) {
            return (
              <EmptyState
                title="Queue is clear"
                message="No pending exception requests need review right now."
              />
            )
          }
          return (
            <div className="space-y-3">
              {prioritized.map(({ exception, score }) => (
                <Card key={exception.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between gap-4 text-base">
                      <span>{exception.title}</span>
                      <Badge variant={riskVariant[exception.riskLevel]}>
                        {exception.riskLevel} risk
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p className="text-muted-foreground">{exception.justification}</p>
                    <p>
                      Asset: <span className="font-medium">{exception.assetName}</span> · Needed by{" "}
                      {formatDate(exception.neededByDate)} · Requested by {exception.requestedBy} ·
                      Priority score {score}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )
        })()
      )}
    </section>
  )
}
