import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import {
  createUser,
  getAllUsers,
  getUserById,
  modifyUser,
} from '../controllers/users';

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

userRouter.patch('me/avatar', celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string().uri().required(),
  }),
}), modifyUser);

userRouter.post('/', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(200).required(),
    avatar: Joi.string().uri().required(),
  }),
}), createUser);

export default userRouter;
