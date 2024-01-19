import { NextFunction, Request, Response } from 'express';
import cardsModel from '../models/card';

export const getCards = async (
  req: Request,
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
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const createdCard = await cardsModel.create({ ...req.body, owner: req.user?._id });
    res.send(createdCard);
  } catch (error) {
    next(error);
  }
};

export const deleteCard = async (
  req: Request,
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
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      next(new Error('Пользователь не авторизован'));
      return;
    }
    const updatedCard = await cardsModel.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    res.send(updatedCard);
  } catch (error) {
    next(error);
  }
};
export const deleteLikeFromCard = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.user) {
      next(new Error('Пользователь не авторизован'));
      return;
    }
    const { cardId } = req.params;
    await cardsModel.findByIdAndUpdate(cardId, {
      $pull: { likes: req.user._id },
    });
    const updatedCard = await cardsModel.findById(cardId);
    res.send(updatedCard);
  } catch (error) {
    next(error);
  }
};
