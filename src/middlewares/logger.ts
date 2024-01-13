import winston from 'winston';
import expressWinston from 'express-winston';
import DailyRotateFile from 'winston-daily-rotate-file';
/**
 * Создаёт логгер запросов для приложения Express.
 *
 * Данный логгер записывает информацию о запросах в консоль и в файлы лога.
 * Файлы лога создаются каждый день и сохраняются в течение 14 дней.
 * Каждый файл лога имеет максимальный размер 20 мегабайт и архивируется.
 */
export const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    new winston.transports.DailyRotateFile({
      filename: 'requests-%DATE%.log',
      datePattern: 'MM-DD-YYYY',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
  format: winston.format.json(),
});

/**
 * Создаёт логгер ошибок для приложения Express.
 *
 * Данный логгер записывает информацию об ошибках в файлы лога.
 * Файлы лога создаются каждый день и сохраняются в течение 14 дней.
 * Каждый файл лога имеет максимальный размер 20 мегабайт и архивируется.
 */
export const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.DailyRotateFile({
      filename: 'error.log',
      datePattern: 'MM-DD-YYYY',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
  format: winston.format.json(),
});
export default {
  requestLogger,
  errorLogger,
};
