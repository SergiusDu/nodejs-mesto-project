export default class CastError extends Error {
  statusCode: number;

  field: string;

  constructor(message: string, field: string) {
    super(message);
    this.name = 'CastError';
    this.statusCode = 400;
    this.field = field;
  }
}
