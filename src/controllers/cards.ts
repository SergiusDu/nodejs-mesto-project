import { NextFunction, Request, Response } from 'express';
import cardsModel from '../models/card';

export const getCards = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const cards = await cardsModel.find({}, {}, { limit: 10 });
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
    await cardsModel.create(req.body);
    res.send(req.body);
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
    if (!cardId) {
      next(new Error('There is no ID in request'));
    }
    const response = await cardsModel.deleteOne({ _id: cardId });
    if (response.deletedCount > 0) {
      res.send('Card has been deleted');
    }
    next(new Error('There is no card with this ID'));
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
    const updatedCard = await cardsModel.findByIdAndUpdate(req.params.cardId, {
      $pull: { likes: req.user._id },
    });
    res.send(updatedCard);
  } catch (error) {
    next(error);
  }
};
