import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import {
  addLikeToCard,
  createCard,
  deleteCard, deleteLikeFromCard,
  getCards,
} from '../controllers/cards';

const cards = Router();

cards.post('/', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().uri().required(),
    owner: Joi.string().required(),
    createAt: Joi.date().required(),
  }),
}), createCard);
cards.get('/', getCards);
cards.delete('/:cardId', celebrate(
  {
    [Segments.PARAMS]: Joi.object().keys({
      cardId: Joi.string().required(),
    }),
  },
), deleteCard);
cards.put('/cards/:cardId/likes', celebrate(
  {
    [Segments.PARAMS]: Joi.object().keys({
      cadId: Joi.string().required(),
    }),
    [Segments.BODY]: Joi.object().keys(
      {
        user: Joi.object().keys({
          _id: Joi.string().required(),
        }),
      },
    ),
  },
), addLikeToCard);
cards.delete('/cards/:cardId/likes', celebrate(
  {
    [Segments.PARAMS]: Joi.object().keys({
      cadId: Joi.string().required(),
    }),
    [Segments.BODY]: Joi.object().keys(
      {
        user: Joi.object().keys({
          _id: Joi.string().required(),
        }),
      },
    ),
  },
), deleteLikeFromCard);
export default cards;
