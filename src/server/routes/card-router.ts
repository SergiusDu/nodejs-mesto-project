import { Router } from 'express';
import {
  addLikeToCard,
  createCard,
  deleteCard,
  deleteLikeFromCard,
  getCards,
} from '../controllers/cards';
import { ROOT_PATH } from '../constants/common';
import {
  VALIDATE_DELETE_CARD,
  VALIDATE_DELETE_LIKE,
  VALIDATE_POST_CARD,
  VALIDATE_PUT_LIKE,
} from '../utils/validation/cards';
import { CARD_ID_ROUTE, CARD_LIKES_ROUTE } from '../constants/card';

const cardRouter = Router();
cardRouter.get(
  ROOT_PATH,
  getCards,
);

cardRouter.post(
  ROOT_PATH,
  VALIDATE_POST_CARD,
  createCard,
);

cardRouter.delete(
  CARD_ID_ROUTE,
  VALIDATE_DELETE_CARD,
  deleteCard,
);
cardRouter.put(
  CARD_LIKES_ROUTE,
  VALIDATE_PUT_LIKE,
  addLikeToCard,
);
cardRouter.delete(
  CARD_LIKES_ROUTE,
  VALIDATE_DELETE_LIKE,
  deleteLikeFromCard,
);
export default cardRouter;
