import { celebrate, Joi, Segments } from 'celebrate';
import { IJwtUserSignature, IUser } from '../../types/user';
import {
  USER_ABOUT_MAX_LENGTH,
  USER_ABOUT_MIN_LENGTH,
  USER_CHANGE_PARAMS_MIN_LENGTH,
  USER_NAME_MAX_LENGTH,
  USER_NAME_MIN_LENGTH,
} from '../../constants/user';
import { VALIDATE_JWT, VALIDATE_URL } from './common';

export function isValidUser(obj: any): obj is IUser {
  return typeof obj._id === 'string'
    && typeof obj.name === 'string'
    && typeof obj.about === 'string'
    && typeof obj.avatar === 'string'
    && typeof obj.email === 'string'
    && typeof obj.password === 'string'
    && (
      typeof obj.token === 'string' || obj.token === undefined
    )
    && (
      typeof obj.__v === 'number' || obj.__v === undefined
    );
}

export function isValidJwsUserSignature(obj: any): obj is IJwtUserSignature {
  const currentTimeInSeconds = Math.floor(Date.now() / 1000);
  return typeof obj._id === 'string'
    && typeof obj.iat === 'number'
    && typeof obj.exp === 'number'
    && obj.exp > currentTimeInSeconds;
}

export const VALIDATE_JSON_CONTENT_TYPE_HEADER = Joi.object({
  'content-type': Joi.string().valid('application/json').required(),
});
export const VALIDATE_USER_NAME = Joi.string()
  .min(USER_NAME_MIN_LENGTH).max(USER_NAME_MAX_LENGTH);
export const VALIDATE_USER_ABOUT = Joi.string()
  .min(USER_ABOUT_MIN_LENGTH).max(USER_ABOUT_MAX_LENGTH);

export const VALIDATE_USER_ID = Joi.string().required();
export const VALIDATE_GET_USER_BY_ID = celebrate({
  [Segments.COOKIES]: VALIDATE_JWT.unknown(),
  [Segments.PARAMS]: Joi.object().keys({
    userId: VALIDATE_USER_ID,
  }),
});
export const VALIDATE_USER_PROFILE_PATCH = celebrate({
  [Segments.COOKIES]: VALIDATE_JWT.unknown(),
  [Segments.BODY]: Joi.object().keys({
    name: VALIDATE_USER_NAME,
    about: VALIDATE_USER_ABOUT,
    avatar: VALIDATE_URL,
  }).min(USER_CHANGE_PARAMS_MIN_LENGTH),
});

export const VALIDATE_USER_AVATAR_PATCH = celebrate({
  [Segments.COOKIES]: VALIDATE_JWT.unknown(),
  [Segments.BODY]: Joi.object().keys({
    avatar: VALIDATE_URL.required(),
  }),
});
