export class AppError extends Error {
  public readonly httpCode: number;

  constructor(message: string, httpCode: number) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);

    this.name = new.target.name;
    this.httpCode = httpCode;
    this.message = message;

    Error.captureStackTrace(this, new.target);
  }
}
