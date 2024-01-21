import { NextFunction, Request, Response } from 'express';
import { constants as errorConstants } from 'http2';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../models/user';
import { IUser } from '../types/types';

export const createUser = async (req: Request, res: Response) => {
  try {
    const {
      email, password, name, about, avatar,
    } = req.body;
    const createdUser = await userModel.create({
      email,
      password: await bcrypt.hash(password, 10),
      name,
      about,
      avatar,
    });
    res.send(createdUser);
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

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const existedUser = await userModel.findOne({ email }).select('+password');
    if (!existedUser) return next(new Error('Пользователь не найден'));
    const passwordMatch = await bcrypt.compare(password, existedUser.password);
    if (!passwordMatch) return next(new Error('Неверный пароль'));
    const token = jwt.sign({ userId: existedUser._id }, existedUser.password, { expiresIn: 3600 });
    res.cookie('jwt', token, {
      maxAge: 3600000,
      httpOnly: true,
    }).send({ token });
  } catch (error) {
    next(error);
  }
};
