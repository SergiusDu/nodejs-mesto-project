import { Request, Response } from 'express';
import { constants as errorConstants } from 'http2';
import User from '../models/user';

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, about, avatar } = req.body;
    await User.create({
      name,
      about,
      avatar,
    });
    res.send({ message: 'Пользователь успешно создан' });
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Ошибка создания пользователя: ${error.message}`);
    } else {
      console.error('Неизвестная ошибка при создании пользователя');
    }
    res
      .status(errorConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: 'Ошибка на стороне сервера' });
  }
};
