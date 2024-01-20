import { NextFunction, Request, Response } from 'express';
import { constants as errorConstants } from 'http2';
import userModel from '../models/user';
import { IUser } from '../types/types';

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, about, avatar } = req.body;
    await userModel.create({
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

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const allUsers = await userModel.find({});
    res.send(allUsers);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const userData = await userModel.findById(userId);
    if (!userData) {
      res.send('User not found');
    }
    res.send(userData);
  } catch (error) {
    next(error);
  }
};

export const modifyUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?._id) {
      next(new Error('User not authorized'));
    }
    const updateData : Partial<IUser> = {};
    if (req.body.name) updateData.name = req.body.name;
    if (req.body.about) updateData.about = req.body.about;
    if (req.body.avatar) updateData.avatar = req.body.avatar;
    const updatedProfile = await userModel.findByIdAndUpdate(
      req.user?._id,
      updateData,
      { new: true },
    );
    res.send(updatedProfile);
  } catch (error) {
    next(error);
  }
};
