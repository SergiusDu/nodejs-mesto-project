export default class NetworkError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
    this.statusCode = 503;
  }
}
