export default class NotAuthorizedError extends Error {
  statusCode: number;

  constructor(message: string = 'Неавторизованный доступ') {
    super(message);
    this.name = 'NotAuthorizedError';
    this.statusCode = 401;
  }
}
