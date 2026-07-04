/**
 * Telemetry abstraction.
 *
 * Phase 1 ships a console-backed implementation. Phase 5 wires this
 * abstraction to Application Insights without changing call sites.
 */

export interface Telemetry {
  trackEvent(name: string, properties?: Record<string, unknown>): void
  trackError(error: unknown, properties?: Record<string, unknown>): void
}

class ConsoleTelemetry implements Telemetry {
  trackEvent(name: string, properties?: Record<string, unknown>): void {
    console.info(`[telemetry] ${name}`, properties ?? {})
  }

  trackError(error: unknown, properties?: Record<string, unknown>): void {
    console.error("[telemetry] error", error, properties ?? {})
  }
}

export const telemetry: Telemetry = new ConsoleTelemetry()
