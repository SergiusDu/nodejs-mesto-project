import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import { isEmail, isURL } from 'validator';
import {
  createUser,
  getAllUsers,
  getUserById, login,
  modifyUser,
} from '../controllers/users';
import { URL_REGEXP } from '../constants/common';

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
    avatar: Joi.string().uri().custom((value) => {
      if (isURL(value) && URL_REGEXP.test(value)) return value;
      throw new Error('Некорректный URL');
    }).required(),
  }),
}), modifyUser);

userRouter.post('/', celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().min(2).email().custom((value) => {
      if (isEmail(value)) return value;
      throw new Error('Некорректный email');
    })
      .required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(200).required(),
    avatar: Joi.string().uri().custom((value) => {
      if (isURL(value) && URL_REGEXP.test(value)) return value;
      throw new Error('Некорректный URL');
    }).required(),
  }),
}), createUser);
userRouter.post('/signin', login);
// celebrate({
//   [Segments.BODY]: {
//     email: Joi.string().min(2).email().custom((value) => {
//       if (isEmail(value)) return value;
//       throw new Error('Некорректный email');
//     })
//       .required(),
//     password: Joi.string().min(6).required(),
//   },
// })

export default userRouter;
