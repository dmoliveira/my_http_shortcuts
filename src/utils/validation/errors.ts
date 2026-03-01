/**
 * Represents a typed error with a stable code for handling.
 */
export class AppError extends Error {
  public readonly code: string;

  /**
   * Creates a new typed application error.
   */
  constructor(code: string, message: string) {
    super(message);
    this.name = "AppError";
    this.code = code;
  }
}
