export class AppError extends Error {
  public readonly httpCode: number;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    httpCode: number,
    isOperational: boolean = true
  ) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);

    this.name = new.target.name;
    this.httpCode = httpCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, new.target);
  }
}

export class DbError extends AppError {
  public readonly code?: string;
  public readonly errno?: number;
  constructor(
    code: string,
    errno: number,
    message: string,
    httpCode: number,
    isOperational: boolean = true
  ) {
    super(message, httpCode, isOperational);
    this.code = code;
    this.errno = errno;
  }
}

export function isDbError(
  error: unknown
): error is { code: string; errno: number; sqlMessage: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    'errno' in error &&
    'sqlMessage' in error &&
    typeof error.code === 'string' &&
    typeof error.errno === 'number' &&
    typeof error.sqlMessage === 'string'
  );
}
