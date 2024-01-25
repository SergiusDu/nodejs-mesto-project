export default class ValidationError extends Error {
  statusCode: number;

  errors: Record<string, any>;

  constructor(message: string, errors: Record<string, any> = {}) {
    super(message);
    this.name = 'ValidationError';
    this.statusCode = 400;
    this.errors = errors;
  }
}
