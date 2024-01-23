import { NextFunction, Response } from 'express';
import cardsModel from '../models/card';
import { IJwtUserSignature, RequestOrRequestWithJwt } from '../types/user';
import { isValidJwsUserSignature } from '../utils/validation/user';

export const getCards = async (
  req: RequestOrRequestWithJwt,
  res: Response,
  next: NextFunction,
) => {
  try {
    const cards = await cardsModel.find({}, {});
    res.send({ data: cards });
  } catch (error) {
    next(error);
  }
};

export const createCard = async (
  req: RequestOrRequestWithJwt,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!isValidJwsUserSignature(req)) {
      return next(new Error('Необходима авторизация'));
    }
    const { _id } = req.user as IJwtUserSignature;
    const createdCard = await cardsModel.create({ ...req.body, owner: _id });
    return res.send(createdCard);
  } catch (error) {
    return next(error);
  }
};

export const deleteCard = async (
  req: RequestOrRequestWithJwt,
  res: Response,
  next: NextFunction,
) => {
  try {
    const cardId = req.params?.cardId;
    const deleteResults = await cardsModel.deleteOne({ _id: cardId });
    if (deleteResults.deletedCount < 1) {
      res.status(404).send('Карточка с указанным _id не найдена.');
      return;
    }
    res.send('Карточка была удалена');
  } catch (error) {
    next(error);
  }
};

export const addLikeToCard = async (
  req: RequestOrRequestWithJwt,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!isValidJwsUserSignature(req)) {
      return next(new Error('Пользователь не авторизован'));
    }
    const { _id } = req.user as IJwtUserSignature;
    const updatedCard = await cardsModel.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: _id } },
      { new: true },
    );
    return res.send(updatedCard);
  } catch (error) {
    return next(error);
  }
};
export const deleteLikeFromCard = async (
  req: RequestOrRequestWithJwt,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!isValidJwsUserSignature(req)) {
      return next(new Error('Пользователь не авторизован'));
    }
    const { _id } = req.user as IJwtUserSignature;
    const { cardId } = req.params;
    await cardsModel.findByIdAndUpdate(cardId, {
      $pull: { likes: _id },
    });
    const updatedCard = await cardsModel.findById(cardId);
    return res.send(updatedCard);
  } catch (error) {
    return next(error);
  }
};
