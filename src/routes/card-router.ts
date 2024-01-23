import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import {
  addLikeToCard,
  createCard,
  deleteCard, deleteLikeFromCard,
  getCards,
} from '../controllers/cards';

const cardRouter = Router();
// TODO Доделать валидацию url
cardRouter.post('/', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().uri().required(),
    createAt: Joi.date().required(),
  }),
}), createCard);
cardRouter.get('/', getCards);
cardRouter.delete('/:cardId', celebrate(
  {
    [Segments.PARAMS]: Joi.object().keys({
      cardId: Joi.string().required(),
    }),
  },
), deleteCard);
cardRouter.put('/:cardId/likes', celebrate(
  {
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
), addLikeToCard);
cardRouter.delete('/:cardId/likes', celebrate(
  {
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
), deleteLikeFromCard);
export default cardRouter;
