import { celebrate, Joi, Segments } from 'celebrate';
import { ICard } from '../../types/card';
import { VALIDATE_MONGOOSE_ID, VALIDATE_URL } from './common';
import { CARD_NAME_MAX_LENGTH, CARD_NAME_MIN_LENGTH } from '../../constants/card';

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
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(CARD_NAME_MIN_LENGTH).max(CARD_NAME_MAX_LENGTH).required(),
    link: VALIDATE_URL.required(),
  }),
});

export const VALIDATE_DELETE_CARD = celebrate(
  {
    [Segments.PARAMS]: Joi.object().keys({
      cardId: VALIDATE_MONGOOSE_ID.required(),
    }),
  },
);
export const VALIDATE_PUT_LIKE = celebrate(
  {
    [Segments.PARAMS]: Joi.object().keys({
      cardId: VALIDATE_MONGOOSE_ID.required(),
    }),
    [Segments.BODY]: Joi.object().keys(
      {
        user: Joi.object().keys(
          {
            _id: VALIDATE_MONGOOSE_ID.required(),
          },
        ),
      },
    ),
  },
);

export const VALIDATE_DELETE_LIKE = celebrate(
  {
    [Segments.PARAMS]: Joi.object().keys({
      cardId: VALIDATE_MONGOOSE_ID.required(),
    }),
  },
);
