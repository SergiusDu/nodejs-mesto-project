export default class DuplicateKeyError extends Error {
  statusCode: number;

  keyValue: Record<string, any>;

  constructor(message: string, keyValue: Record<string, any>) {
    super(message);
    this.name = 'DuplicateKeyError';
    this.statusCode = 409;
    this.keyValue = keyValue;
  }
}
