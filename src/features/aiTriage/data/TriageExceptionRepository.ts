import type { TriageException } from "../domain/triageException"

/**
 * Repository interface for high-risk exception requests (future `aw_exceptionrequest`).
 */
export interface TriageExceptionRepository {
  listTriageExceptions(): Promise<TriageException[]>
  getTriageException(id: string): Promise<TriageException | undefined>
}
