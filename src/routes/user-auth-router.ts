import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import { isEmail, isURL } from 'validator';
import { createUser, login } from '../controllers/users';
import { URL_REGEXP } from '../constants/common';
import { USER_SIGNIN_ROUTE, USER_SIGNUP_ROUTE } from '../constants/user';

const userAuthRouter = Router();

userAuthRouter.post(USER_SIGNIN_ROUTE, celebrate({
  [Segments.BODY]: {
    email: Joi.string().min(2).email().custom((value) => {
      if (isEmail(value)) return value;
      throw new Error('Некорректный email');
    })
      .required(),
    password: Joi.string().min(6).required(),
  },
}), login);

userAuthRouter.post(USER_SIGNUP_ROUTE, celebrate({
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

export default userAuthRouter;
