import { ICard } from '../../types/card';

export function isValidCard(card: any): card is ICard {
  return typeof card._id === 'string'
  && typeof card.name === 'string'
  && typeof card.link === 'string'
  && typeof card.owner === 'string'
  && Array.isArray(card.likes)
  && typeof card.createdAt === 'string'
  && typeof card.__v === 'number';
}
