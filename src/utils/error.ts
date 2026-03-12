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
    this.message = message;

    Error.captureStackTrace(this, new.target);
  }
}
