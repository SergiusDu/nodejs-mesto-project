import { NextFunction, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Error as MongooseError } from 'mongoose';
import dotenv from 'dotenv';
import userModel from '../models/user';
import { IUser, RequestOrRequestWithJwt } from '../types/user';
import { isValidJwsUserSignature } from '../utils/validation/user';
import handleMongooseError from '../utils/handlers/mongoose-error-handler';
import InternalServerError from '../errors/internal-server-error';
import NotAuthorizedError from '../errors/not-authorized-error';
import NotFoundError from '../errors/not-found-error';
import { COOKIE_MAX_AGE, JWT_EXPIRATION_TIME } from '../constants/common';
import {
  AUTHORIZATION_ERROR_MESSAGE,
  INTERNAL_SERVER_ERROR_WHILE_CREATING_USER_MESSAGE,
  USER_DATA_CHANGING_UNKNOWN_ERROR_MESSAGE,
  USER_DELETED_SUCCESS_MESSAGE,
  USER_DELETION_UNKNOWN_ERROR_MESSAGE,
  USER_FETCH_BY_ID_UNKNOWN_ERROR_MESSAGE,
  USER_LOGIN_UNKNOWN_ERROR_MESSAGE,
  USER_NOT_FOUND_ERROR_MESSAGE,
  USERS_FETCH_UNKNOWN_ERROR_MESSAGE,
  WRONG_PASSWORD_ERROR_MESSAGE,
} from '../constants/error';
import {
  USER_DEFAULT_ABOUT,
  USER_DEFAULT_AVATAR,
  USER_DEFAULT_NAME,
} from '../constants/user';

/**
 * Асинхронный обработчик для создания нового пользователя.
 * Принимает данные пользователя из тела запроса, хэширует пароль и сохраняет
 * пользователя в базе данных.
 * В случае успешного создания, отправляет обратно
 * созданного пользователя.
 * В случае возникновения ошибок, обработка ошибок
 * передается через next() для дальнейшей обработки.
 *
 * @param {RequestOrRequestWithJwt} req - Объект запроса Express.
 * Должен содержать 'email', 'password', 'name', 'about', 'avatar' в теле
 *   запроса.
 * @param {Response} res - Объект ответа Express, используется для отправки
 *   ответа.
 * @param {NextFunction} next - Функция обратного вызова Express для передачи
 *   управления следующему middleware в стеке.
 * @returns {Promise<void>} Возвращает Promise, который выполняется без
 *   возвращаемого значения.
 * @throws {InternalServerError} В случае ошибок на стороне сервера или с базой
 *   данных.
 * @throws {MongooseError} В случае ошибок валидации данных или других ошибок
 *   Mongoose.
 */
export const createUser = async (
  req: RequestOrRequestWithJwt,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {
      email,
      password,
      name = USER_DEFAULT_NAME,
      about = USER_DEFAULT_ABOUT,
      avatar = USER_DEFAULT_AVATAR,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = await userModel.create({
      email,
      password: hashedPassword,
      name,
      about,
      avatar,
    });

    res.send(createdUser);
  } catch (error) {
    if (error instanceof MongooseError) {
      handleMongooseError(error, next);
      return;
    }
    next(new InternalServerError(INTERNAL_SERVER_ERROR_WHILE_CREATING_USER_MESSAGE));
  }
};

/**
 * Асинхронный обработчик для получения списка всех пользователей.
 * Выполняет запрос к базе данных для извлечения всех пользователей и
 * отправляет их в ответе.
 * В случае возникновения ошибок, обработка ошибок
 * передается через next() для дальнейшей обработки.
 *
 * @param {RequestOrRequestWithJwt} _ - Объект запроса Express, не используется
 *   в данной функции.
 * @param {Response} res - Объект ответа Express, используется для отправки
 *   списка пользователей.
 * @param {NextFunction} next - Функция обратного вызова Express для передачи
 *   управления следующему middleware в стеке.
 * @returns {Promise<void>} Возвращает Promise, который выполняется без
 *   возвращаемого значения.
 * @throws {InternalServerError} В случае неизвестной ошибки сервера при
 *   попытке получения списка пользователей.
 * @throws {MongooseError} В случае возникновения ошибок при взаимодействии с
 *   базой данных.
 */
export const getAllUsers = async (
  _: RequestOrRequestWithJwt,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const allUsers = await userModel.find({});
    res.send(allUsers);
    return undefined;
  } catch (error) {
    if (error instanceof MongooseError) {
      return handleMongooseError(error, next);
    }
    return next(new InternalServerError(USERS_FETCH_UNKNOWN_ERROR_MESSAGE));
  }
};

/**
 * Асинхронный обработчик для получения данных пользователя по его ID.
 * Поиск пользователя производится в базе данных по ID, полученному из
 * параметров запроса.
 * В случае успешного поиска, возвращает данные
 * пользователя.
 * Если пользователь не найден или происходит ошибка, обработка
 * ошибок передается через next().
 *
 * @param {RequestOrRequestWithJwt} req - Объект запроса Express, содержащий
 *   параметры запроса.
 *   `userId` должен быть включен в `req.params`.
 * @param {Response} res - Объект ответа Express, используется для отправки
 * данных пользователя или ошибки.
 * @param {NextFunction} next - Функция обратного вызова Express для передачи
 * управления следующему middleware в стеке.
 * @returns {Promise<void>} Возвращает Promise, который выполняется без
 *   возвращаемого значения.
 * @throws {NotFoundError} Если пользователь с указанным ID не найден.
 * @throws {InternalServerError} В случае неизвестной ошибки сервера при
 *   попытке
 * получения пользователя по ID.
 * @throws {MongooseError} В случае возникновения ошибок при взаимодействии с
 *   базой данных.
 */
export const getUserById = async (
  req: RequestOrRequestWithJwt,
  res: Response,
  next: NextFunction,
):Promise<void> => {
  try {
    const { userId } = req.params;
    const userData = await userModel.findById(userId);
    if (!userData) {
      next(new NotFoundError(USER_NOT_FOUND_ERROR_MESSAGE));
      return;
    }
    res.send(userData);
  } catch (error) {
    if (error instanceof MongooseError) {
      handleMongooseError(error, next);
    }
    next(new InternalServerError(USER_FETCH_BY_ID_UNKNOWN_ERROR_MESSAGE));
  }
};

export const modifyUser = async (
  req: RequestOrRequestWithJwt,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!isValidJwsUserSignature(req.user)) {
      next(new NotAuthorizedError());
      return;
    }
    const updateData : Partial<IUser> = {};
    if (req.body.name) updateData.name = req.body.name;
    if (req.body.about) updateData.about = req.body.about;
    if (req.body.avatar) updateData.avatar = req.body.avatar;
    const updatedProfile = await userModel.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true },
    );
    res.send(updatedProfile);
  } catch (error) {
    if (error instanceof MongooseError) {
      handleMongooseError(error, next);
    }
    next(new InternalServerError(USER_DATA_CHANGING_UNKNOWN_ERROR_MESSAGE));
  }
};

export const login = async (
  req: RequestOrRequestWithJwt,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const existedUser = await userModel.findOne({ email }).select('+password');
    if (!existedUser) {
      next(new NotFoundError(USER_NOT_FOUND_ERROR_MESSAGE));
      return;
    }
    const passwordMatch = await bcrypt.compare(password, existedUser.password);
    if (!passwordMatch) {
      next(new NotAuthorizedError(WRONG_PASSWORD_ERROR_MESSAGE));
      return;
    }
    const token = jwt.sign({ _id: existedUser._id }, process.env.NODE_ENV || 'some-secret-key', { expiresIn: COOKIE_MAX_AGE });
    const { password: _, ...user } = existedUser.toObject();
    res.cookie('jwt', token, {
      maxAge: JWT_EXPIRATION_TIME,
      httpOnly: true,
    }).send({ token, user });
  } catch (error) {
    if (error instanceof MongooseError) {
      handleMongooseError(error, next);
    }
    next(new InternalServerError(USER_LOGIN_UNKNOWN_ERROR_MESSAGE));
  }
};

export const deleteUser = async (
  req: RequestOrRequestWithJwt,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!isValidJwsUserSignature(req.user)) {
      next(new NotAuthorizedError(AUTHORIZATION_ERROR_MESSAGE));
      return;
    }
    const userId = req.user._id;
    const deletedUser = await userModel.findByIdAndDelete(userId);
    if (!deletedUser) {
      next(new NotFoundError(USER_NOT_FOUND_ERROR_MESSAGE));
      return;
    }
    res.send({ message: USER_DELETED_SUCCESS_MESSAGE });
  } catch (error) {
    if (error instanceof MongooseError) {
      handleMongooseError(error, next);
    }
    next(new InternalServerError(USER_DELETION_UNKNOWN_ERROR_MESSAGE));
  }
};
