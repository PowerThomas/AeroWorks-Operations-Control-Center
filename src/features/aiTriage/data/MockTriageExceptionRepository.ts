import { delay } from "@/shared/utils/delay"
import type { TriageException } from "../domain/triageException"
import type { TriageExceptionRepository } from "./TriageExceptionRepository"
import { mockTriageExceptions } from "./mockTriageExceptions"

/** Async, promise-based mock implementation backed by a typed in-memory dataset. */
export class MockTriageExceptionRepository implements TriageExceptionRepository {
  private readonly exceptions: TriageException[]
  private readonly latencyMs: number

  constructor(exceptions: TriageException[] = mockTriageExceptions, latencyMs: number = 300) {
    this.exceptions = exceptions
    this.latencyMs = latencyMs
  }

  async listTriageExceptions(): Promise<TriageException[]> {
    await delay(this.latencyMs)
    return [...this.exceptions]
  }

  async getTriageException(id: string): Promise<TriageException | undefined> {
    await delay(this.latencyMs)
    return this.exceptions.find((exception) => exception.id === id)
  }
}

let defaultRepository: TriageExceptionRepository | undefined

/** Factory returning the app-wide default TriageExceptionRepository (mock in Phase 1). */
export function getTriageExceptionRepository(): TriageExceptionRepository {
  defaultRepository ??= new MockTriageExceptionRepository()
  return defaultRepository
}
