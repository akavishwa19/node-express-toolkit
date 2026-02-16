export class AppResponse {
  public readonly message: string;
  public readonly data: unknown;
  public readonly success: boolean;

  constructor(message: string, data: unknown = null, success: boolean = true) {
    this.message = message;
    this.data = data;
    this.success = success;
  }
}
