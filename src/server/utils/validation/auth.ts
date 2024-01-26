import { celebrate, Joi, Segments } from 'celebrate';
import { isEmail, isURL } from 'validator';
import { URL_REGEXP } from '../../constants/common';
import {
  USER_ABOUT_MAX_LENGTH,
  USER_ABOUT_MIN_LENGTH, USER_EMAIL_MIN_LENGTH,
  USER_NAME_MAX_LENGTH,
  USER_NAME_MIN_LENGTH, USER_PASSWORD_MIN_LENGTH,
} from '../../constants/user';

export const VALIDATE_SIGNUP = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().min(USER_EMAIL_MIN_LENGTH).email().custom((value) => {
      if (isEmail(value)) return value;
      throw new Error('Некорректный email');
    })
      .required(),
    password: Joi.string().min(USER_PASSWORD_MIN_LENGTH).required(),
    name: Joi.string().min(USER_NAME_MIN_LENGTH).max(USER_NAME_MAX_LENGTH).required(),
    about: Joi.string().min(USER_ABOUT_MIN_LENGTH).max(USER_ABOUT_MAX_LENGTH).required(),
    avatar: Joi.string().uri().custom((value) => {
      if (isURL(value) && URL_REGEXP.test(value)) return value;
      throw new Error('Некорректный URL');
    }).required(),
  }),
});
export const VALIDATE_SIGNIN = celebrate({
  [Segments.BODY]: {
    email: Joi.string().min(USER_EMAIL_MIN_LENGTH).email().custom((value) => {
      if (isEmail(value)) return value;
      throw new Error('Некорректный email');
    })
      .required(),
    password: Joi.string().min(USER_PASSWORD_MIN_LENGTH).required(),
  },
});
