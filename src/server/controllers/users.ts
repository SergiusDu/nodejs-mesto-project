import { NextFunction, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Error as MongooseError } from 'mongoose';
import userModel from '../models/user';
import { IUser, RequestOrRequestWithJwt } from '../types/user';
import { isValidJwsUserSignature } from '../utils/validation/user';
import handleMongooseError from '../utils/handlers/mongoose-error-handler';
import {
  AUTHORIZATION_ERROR_MESSAGE,
  INTERNAL_SERVER_ERROR_WHILE_CREATING_USER_MESSAGE,
  USER_DELETED_SUCCESS_MESSAGE,
  USER_NOT_FOUND_ERROR_MESSAGE,
  USERS_FETCH_UNKNOWN_ERROR_MESSAGE,
  WRONG_PASSWORD_ERROR_MESSAGE,
} from '../constants/error';
import {
  USER_DEFAULT_ABOUT,
  USER_DEFAULT_AVATAR,
  USER_DEFAULT_NAME,
} from '../constants/user';
import InternalServerError from '../errors/internal-server-error';
import NotFoundError from '../errors/not-found-error';
import NotAuthorizedError from '../errors/not-authorized-error';
import {
  COOKIE_MAX_AGE,
  JWT_EXPIRATION_TIME,
  RES_CREATED_CODE,
} from '../constants/common';
import ValidationError from '../errors/validation-error';

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
export const createUser = (
  req: RequestOrRequestWithJwt, // Предполагается, что этот тип определен
  res: Response,
  next: NextFunction,
): void => {
  const {
    email,
    password,
    name = USER_DEFAULT_NAME,
    about = USER_DEFAULT_ABOUT,
    avatar = USER_DEFAULT_AVATAR,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hashedPassword) => userModel.create({
      email,
      password: hashedPassword,
      name,
      about,
      avatar,
    }))
    .then((createdUser) => {
      res.status(RES_CREATED_CODE).send(createdUser);
    })
    .catch((error) => {
      console.log(error);
      if (error instanceof MongooseError) {
        handleMongooseError(error, next);
      } else {
        next(new InternalServerError(INTERNAL_SERVER_ERROR_WHILE_CREATING_USER_MESSAGE));
      }
    });
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
export const getAllUsers = (
  _: RequestOrRequestWithJwt,
  res: Response,
  next: NextFunction,
): void => {
  userModel.find({})
    .then((allUsers) => {
      res.send(allUsers);
    })
    .catch((error) => {
      if (error instanceof MongooseError) {
        handleMongooseError(error, next);
      } else {
        next(new InternalServerError(USERS_FETCH_UNKNOWN_ERROR_MESSAGE));
      }
    });
};

export const getProfileData = (
  req: RequestOrRequestWithJwt,
  res: Response,
  next: NextFunction,
) => {
  if (!isValidJwsUserSignature(req.user)) {
    next(new NotAuthorizedError());
    return;
  }
  userModel.findById(req.user._id)
    .orFail(new NotFoundError())
    .then((userData) => res.send(userData))
    .catch((error) => {
      if (error instanceof MongooseError) {
        handleMongooseError(error, next);
      }
      next(error);
    });
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
export const getUserById = (
  req: RequestOrRequestWithJwt,
  res: Response,
  next: NextFunction,
): void => {
  const { userId } = req.params;

  userModel.findById(userId)
    .orFail(new NotFoundError(USER_NOT_FOUND_ERROR_MESSAGE))
    .then((userData) => {
      res.send(userData);
    })
    .catch((error) => {
      if (error instanceof MongooseError) {
        handleMongooseError(error, next);
      } else {
        next(error);
      }
    });
};
export const updateAvatar = (
  req: RequestOrRequestWithJwt,
  res: Response,
  next: NextFunction,
): void => {
  if (!isValidJwsUserSignature(req.user)) {
    next(new NotAuthorizedError());
    return;
  }

  if (!req.body.avatar) {
    next(new ValidationError('Поле avatar должно быть заполнено'));
    return;
  }

  const updateData: Pick<IUser, 'avatar'> = { avatar: req.body.avatar };

  userModel.findByIdAndUpdate(
    req.user._id,
    updateData,
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(new NotFoundError())
    .then((updatedProfile) => {
      res.send(updatedProfile);
    })
    .catch((error) => {
      if (error instanceof MongooseError) {
        handleMongooseError(error, next);
      } else {
        next(error);
      }
    });
};

export const modifyUser = (
  req: RequestOrRequestWithJwt, // Предполагается, что этот тип определен
  res: Response,
  next: NextFunction,
): void => {
  if (!isValidJwsUserSignature(req.user)) {
    next(new NotAuthorizedError());
    return;
  }

  const updateData: Partial<IUser> = {};
  if (req.body.name) updateData.name = req.body.name;
  if (req.body.about) updateData.about = req.body.about;
  if (req.body.avatar) updateData.avatar = req.body.avatar;

  userModel.findByIdAndUpdate(
    req.user._id,
    updateData,
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(new NotFoundError())
    .then((updatedProfile) => {
      res.send(updatedProfile);
    })
    .catch((error) => {
      if (error instanceof MongooseError) {
        handleMongooseError(error, next);
      } else {
        next(error);
      }
    });
};

export const login = (
  req: RequestOrRequestWithJwt,
  res: Response,
  next: NextFunction,
): void => {
  const { email, password } = req.body;
  userModel.findOne({ email }).select('+password')
    .orFail(new NotFoundError(USER_NOT_FOUND_ERROR_MESSAGE))
    .then((existedUser) => bcrypt.compare(password, existedUser.password)
      .then((passwordMatch) => {
        if (!passwordMatch) {
          throw new NotAuthorizedError(WRONG_PASSWORD_ERROR_MESSAGE);
        }
        const token = jwt.sign(
          { _id: existedUser._id },
          process.env.NODE_ENV ?? 'some-secret-key',
          { expiresIn: COOKIE_MAX_AGE },
        );
        const { password: _, ...user } = existedUser.toObject();
        res.cookie('jwt', token, {
          maxAge: JWT_EXPIRATION_TIME,
          httpOnly: true,
        }).send({ token, user });
      }))
    .catch((error) => {
      if (error instanceof MongooseError) {
        handleMongooseError(error, next);
      } else {
        next(error);
      }
    });
};

export const deleteUser = (
  req: RequestOrRequestWithJwt, // Предполагается, что этот тип определен
  res: Response,
  next: NextFunction,
): void => {
  if (!isValidJwsUserSignature(req.user)) {
    next(new NotAuthorizedError(AUTHORIZATION_ERROR_MESSAGE));
    return;
  }

  const userId = req.user._id;
  userModel.findByIdAndDelete(userId)
    .orFail(new NotFoundError(USER_NOT_FOUND_ERROR_MESSAGE))
    .then(() => {
      res.send({ message: USER_DELETED_SUCCESS_MESSAGE });
    })
    .catch((error) => {
      if (error instanceof MongooseError) {
        handleMongooseError(error, next);
      } else {
        next(error);
      }
    });
};
