import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import { isURL } from 'validator';
import {
  deleteUser,
  getAllUsers,
  getUserById,
  modifyUser,
} from '../controllers/users';
import { URL_REGEXP } from '../constants/common';
import { USER_CHANGE_AVATAR_ROUTE, USER_DELETE_ROUTE } from '../constants/user';

const userRouter = Router();

userRouter.get('/', getAllUsers);

userRouter.get(
  '/:userId',
  celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      userId: Joi.string().required(),
    }),
  }),
  getUserById,
);

userRouter.patch('/me', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().uri(),
  }).min(1),
}), modifyUser);

userRouter.patch(USER_CHANGE_AVATAR_ROUTE, celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string().uri().custom((value) => {
      if (isURL(value) && URL_REGEXP.test(value)) return value;
      throw new Error('Некорректный URL');
    }).required(),
  }),
}), modifyUser);

userRouter.delete(USER_DELETE_ROUTE, deleteUser);

export default userRouter;
