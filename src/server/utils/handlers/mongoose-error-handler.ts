import { Error as MongooseError } from 'mongoose';
import { NextFunction } from 'express';
import ValidationError from '../../errors/validation-error';
import CastError from '../../errors/cast-error';
import DuplicateKeyError from '../../errors/duplicate-key-error';
import InternalServerError from '../../errors/internal-server-error';
import NotFoundError from '../../errors/not-found-error';
import {
  CAST_ERROR_MESSAGE,
  DOCUMENT_NOT_FOUND_ERROR_MESSAGE,
  DUPLICATE_KEY_ERROR_CODE,
  DUPLICATE_KEY_ERROR_MESSAGE, INTERNAL_SERVER_ERROR_MESSAGE,
  VALIDATION_ERROR_MESSAGE,
} from '../../constants/error';

/**
 * Обрабатывает ошибки, генерируемые Mongoose, и преобразует их в
 * соответствующие пользовательские ошибки.
 *
 * @param {MongooseError | any} error - Ошибка, возникшая в результате операции
 *   Mongoose.
 * @param {NextFunction} next - Функция Express `next` для передачи управления
 *   следующему обработчику ошибок.
 * @throws {ValidationError} Когда происходит ошибка валидации данных в
 *   Mongoose.
 * @throws {CastError} Когда Mongoose не может преобразовать значение в
 *   требуемый тип.
 * @throws {DuplicateKeyError} Когда возникает ошибка дублирования уникального
 *   ключа в MongoDB.
 * @throws {NotFoundError} Когда документ, который должен быть обновлен или
 *   удален, не найден.
 * @throws {InternalServerError} В случае других ошибок, связанных с Mongoose.
 */
export default function handleMongooseError(error: any, next: NextFunction) {
  if (error instanceof MongooseError.ValidationError) {
    next(new ValidationError(VALIDATION_ERROR_MESSAGE, error.errors));
    return;
  }
  if (error instanceof MongooseError.CastError) {
    next(new CastError(CAST_ERROR_MESSAGE, error.path));
    return;
  }
  if ('code' in error && error.code === DUPLICATE_KEY_ERROR_CODE) {
    const { keyValue } = (error as any);
    next(new DuplicateKeyError(DUPLICATE_KEY_ERROR_MESSAGE, keyValue));
    return;
  }
  if (error instanceof MongooseError.DocumentNotFoundError) {
    next(new NotFoundError(DOCUMENT_NOT_FOUND_ERROR_MESSAGE));
    return;
  }
  next(new InternalServerError(INTERNAL_SERVER_ERROR_MESSAGE));
}
