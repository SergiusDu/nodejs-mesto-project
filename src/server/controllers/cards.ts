import { Error as MongooseError } from 'mongoose';
import { Response, NextFunction } from 'express';
import cardsModel from '../models/card';
import { IJwtUserSignature, RequestOrRequestWithJwt } from '../types/user';
import { isValidJwsUserSignature } from '../utils/validation/user';
import NotAuthorizedError from '../errors/not-authorized-error';
import handleMongooseError from '../utils/handlers/mongoose-error-handler';
import NotFoundError from '../errors/not-found-error';
import {
  AUTHORIZATION_ERROR_MESSAGE,
  CARD_FOR_DELETION_NOT_FOUND_ERROR_MESSAGE,
  INSUFFICIENT_PERMISSIONS_ERROR_MESSAGE,
  UNAUTHORIZED_CARD_CREATION_ERROR_MESSAGE,
  UNAUTHORIZED_CARD_DELETION_ERROR_MESSAGE,
} from '../constants/error';
import { CARD_SUCCESS_DELETION_MESSAGE } from '../constants/card';
import { RES_CREATED_CODE } from '../constants/common';

/**
 * Получает список всех карточек из базы данных.
 *
 * Этот асинхронный обработчик маршрута используется для получения и отправки
 * списка всех карточек, хранящихся в базе данных. Он не принимает никаких
 * параметров в запросе и возвращает массив карточек.
 *
 * @param {_} _ - Объект запроса Express. Не используется в данной функции.
 * @param {Response} res - Объект ответа Express, используется для отправки
 *   ответа.
 * @param {NextFunction} next - Функция Express `next`, используется для
 *   передачи ошибки следующему обработчику.
 *
 * @returns {Promise<void>} Promise, который разрешается после отправки ответа
 *   или передачи ошибки.
 *
 * @example
 * // Пример маршрута, использующего этот обработчик:
 * router.get('/cards', getCards);
 */
export const getCards = async (
  _: RequestOrRequestWithJwt,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const cards = await cardsModel.find({}, {});
    res.send({ cards });
  } catch (error) {
    if (error instanceof MongooseError) {
      handleMongooseError(error, next);
      return;
    }
    next(error);
  }
};

/**
 * Создает новую карточку в базе данных на основе данных запроса.
 *
 * Этот асинхронный обработчик маршрута используется для создания новой
 * карточки. Он требует наличия в запросе тела (body) с данными для карточки и
 * аутентификации пользователя. При успешном создании возвращает созданную
 * карточку.
 *
 * @param {RequestOrRequestWithJwt} req - Объект запроса Express, содержащий
 *   тело запроса и данные пользователя.
 * @param {Response} res - Объект ответа Express, используется для отправки
 *   ответа.
 * @param {NextFunction} next - Функция Express `next`, используется для
 *   передачи ошибки следующему обработчику.
 *
 * @throws {NotAuthorizedError} Если пользователь не авторизован.
 * @throws {MongooseError} Ошибки, связанные с операциями MongoDB.
 *
 * @returns {Promise<void>} Promise, который разрешается после отправки ответа
 *   или передачи ошибки.
 *
 * @example
 * // Пример маршрута, использующего этот обработчик:
 * router.post('/cards', createCard);
 */
export const createCard = async (
  req: RequestOrRequestWithJwt,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!isValidJwsUserSignature(req.user)) {
      next(new NotAuthorizedError(UNAUTHORIZED_CARD_CREATION_ERROR_MESSAGE));
      return;
    }
    const createdCard = await cardsModel.create({ ...req.body, owner: req.user._id });
    res.status(RES_CREATED_CODE).send(createdCard);
  } catch (error) {
    if (error instanceof MongooseError) {
      handleMongooseError(error, next);
      return;
    }
    next(error);
  }
};

export const deleteCard = async (
  req: RequestOrRequestWithJwt,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!isValidJwsUserSignature(req.user)) {
      next(new NotAuthorizedError(UNAUTHORIZED_CARD_DELETION_ERROR_MESSAGE));
      return;
    }
    const cardId = req.params?.cardId;
    const cardToDelete = await cardsModel.findById(cardId)
      .orFail(new NotFoundError(CARD_FOR_DELETION_NOT_FOUND_ERROR_MESSAGE));
    if (cardToDelete.owner.toString() !== req.user._id) {
      next(new NotAuthorizedError(INSUFFICIENT_PERMISSIONS_ERROR_MESSAGE));
      return;
    }
    const deleteResults = await cardsModel.deleteOne({ _id: cardId });
    if (deleteResults.deletedCount < 1) {
      next(new NotFoundError(CARD_FOR_DELETION_NOT_FOUND_ERROR_MESSAGE));
      return;
    }
    res.send(CARD_SUCCESS_DELETION_MESSAGE);
  } catch (error) {
    if (error instanceof MongooseError) {
      handleMongooseError(error, next);
      return;
    }
    next(error);
  }
};

export const addLikeToCard = async (
  req: RequestOrRequestWithJwt,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!isValidJwsUserSignature(req.user)) {
      next(new Error(AUTHORIZATION_ERROR_MESSAGE));
      return;
    }
    const { _id } = req.user as IJwtUserSignature;
    const updatedCard = await cardsModel.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: _id } },
      { new: true },
    )
      .orFail(new NotFoundError());
    res.send(updatedCard);
  } catch (error) {
    if (error instanceof MongooseError) {
      handleMongooseError(error, next);
      return;
    }
    next(error);
  }
};
export const deleteLikeFromCard = async (
  req: RequestOrRequestWithJwt,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!isValidJwsUserSignature(req.user)) {
      next(new Error(AUTHORIZATION_ERROR_MESSAGE));
      return;
    }
    const { _id } = req.user;
    const { cardId } = req.params;
    await cardsModel.findByIdAndUpdate(
      cardId,
      {
        $pull: { likes: _id },
      },
      { new: true },
    )
      .orFail(new NotFoundError());
    const updatedCard = await cardsModel.findById(cardId)
      .orFail(new NotFoundError());
    res.send(updatedCard);
  } catch (error) {
    if (error instanceof MongooseError) {
      handleMongooseError(error, next);
      return;
    }
    next(error);
  }
};
