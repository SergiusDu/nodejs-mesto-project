import { celebrate, Joi, Segments } from 'celebrate';
import { isURL } from 'validator';
import isEmail from 'validator/lib/isEmail';
import { URL_REGEXP } from '../../constants/common';
import ValidationError from '../../errors/validation-error';

export const VALIDATE_DATE = Joi.date();
export const VALIDATE_URL = Joi.string()
  .uri().custom((value) => {
    if (isURL(value) && URL_REGEXP.test(value)) return value;
    throw new ValidationError('Некорректный URL');
  });
export const VALIDATE_MONGOOSE_ID = Joi.string().hex().length(24);

export const VALIDATE_JWT = Joi.object({
  jwt: Joi.string().required(),
  'Max-Age': Joi.number().integer().positive().required(),
  Path: Joi.string().required(),
  Expires: Joi.date().required(),
});

export const VERIFY_AUTH_TOKEN_COOKIE = celebrate({
  [Segments.COOKIES]: VALIDATE_JWT.unknown(),
});

export const MONGOOSE_URL_VALIDATOR = {
  validator(avatar: string) {
    return isURL(avatar) && URL_REGEXP.test(avatar);
  },
  message: (props: any) => `${props.value} - некорректный url`,
};

export const MONGOOSE_EMAIL_VALIDATOR = {
  validator(email: string) { return isEmail(email); },
  message: (props: any) => `${props.value} - некорректный email`,
};
