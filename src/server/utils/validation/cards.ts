import { celebrate, Joi, Segments } from 'celebrate';
import { ICard } from '../../types/card';
import { VALIDATE_DATE, VALIDATE_JWT, VALIDATE_URL } from './common';

export function isValidCard(card: any): card is ICard {
  return typeof card._id === 'string'
  && typeof card.name === 'string'
  && typeof card.link === 'string'
  && typeof card.owner === 'string'
  && Array.isArray(card.likes)
  && typeof card.createdAt === 'string'
  && typeof card.__v === 'number';
}

export const VALIDATE_POST_CARD = celebrate({
  [Segments.COOKIES]: VALIDATE_JWT.unknown(),
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: VALIDATE_URL.required(),
    createAt: VALIDATE_DATE.required(),
  }),
});

export const VALIDATE_DELETE_CARD = celebrate(
  {
    [Segments.COOKIES]: VALIDATE_JWT.unknown(),
    [Segments.PARAMS]: Joi.object().keys({
      cardId: Joi.string().required(),
    }),
  },
);
export const VALIDATE_PUT_LIKE = celebrate(
  {
    [Segments.COOKIES]: VALIDATE_JWT.unknown(),
    [Segments.PARAMS]: Joi.object().keys({
      cardId: Joi.string().required(),
    }),
    [Segments.BODY]: Joi.object().keys(
      {
        user: Joi.object().keys(
          {
            _id: Joi.string().required(),
          },
        ),
      },
    ),
  },
);

export const VALIDATE_DELETE_LIKE = celebrate(
  {
    [Segments.COOKIES]: VALIDATE_JWT.unknown(),
    [Segments.PARAMS]: Joi.object().keys({
      cardId: Joi.string().required(),
    }),
    [Segments.BODY]: Joi.object().keys(
      {
        user: Joi.object().keys({
          _id: Joi.string().required(),
        }),
      },
    ),
  },
);
