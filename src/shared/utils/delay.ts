/** Resolves after `ms` milliseconds; used by mock repositories to simulate latency. */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
