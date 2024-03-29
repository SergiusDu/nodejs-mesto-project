import mongoose from 'mongoose';

const MAX_CONNECTION_ATTEMPTS = 50;
const RECONNECTION_INTERVAL = 5000;
let connectionAttempt = 0;

/**
 * Подключается к MongoDB.
 * Пытается подключиться до достижения максимального числа попыток.
 * В случае неудачи выводит сообщение об ошибке и завершает процесс.
 */
async function connectDb(): Promise<void> {
  if (mongoose.connection.readyState) {
    console.log('MongoDB уже подключен.');
    return;
  }
  const mongoDbUrl = process.env.MONGODB_URI;
  if (!mongoDbUrl) {
    console.error('Ошибка: URL подключения к MongoDB не предоставлен.'
      + ' Укажите MONGODB_URI в .env');
  }
  try {
    const dbConnection = await mongoose.connect(mongoDbUrl || 'mongodb://localhost:27017/mestodb');
    console.log(`MongoDB подключен к: ${dbConnection.connection.host}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Ошибка подключения к MongoDB: ${error.message}`);
    } else {
      console.error('Произошла неизвестная ошибка при подключении к MongoDB');
    }
    connectionAttempt += 1;
    if (connectionAttempt < MAX_CONNECTION_ATTEMPTS) {
      setTimeout(connectDb, RECONNECTION_INTERVAL);
    } else {
      console.error('Превышено максимальное количество попыток подключения к'
        + ' MongoDB.');
    }
  }
}

export default connectDb;
