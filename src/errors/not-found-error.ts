export default class NotFoundError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = 'NotFoundErr';
    this.statusCode = 404;
  }
}
