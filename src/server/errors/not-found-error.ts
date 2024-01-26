export default class NotFoundError extends Error {
  statusCode: number;

  constructor(message: string = 'Документ не найден') {
    super(message);
    this.name = 'NotFoundErr';
    this.statusCode = 404;
  }
}
