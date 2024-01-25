// Константы роутов
export const CARD_BASE_ROUTE = '/cards';
export const CARD_ID_ROUTE = '/:cardId';
export const CARD_LIKES_ROUTE = `${CARD_ID_ROUTE}/likes`;

// Константы эндпоинтов
export const GET_CARDS_ENDPOINT = `${CARD_BASE_ROUTE}`;
export const POST_CARD_ENDPOINT = `${CARD_BASE_ROUTE}`;
export const DELETE_CARD_ENDPOINT = `${CARD_BASE_ROUTE}${CARD_ID_ROUTE}`;
export const ADD_LIKE_TO_CARD_ENDPOINT = `${CARD_BASE_ROUTE}${CARD_LIKES_ROUTE}`;
export const DELETE_LIKE_FROM_CARD_ENDPOINT = `${CARD_BASE_ROUTE}${CARD_LIKES_ROUTE}`;

// Остальные константы

export const CARD_NAME_MIN_LENGTH = 2;
export const CARD_NAME_MAX_LENGTH = 30;

export const CARD_SUCCESS_DELETION_MESSAGE = 'Карточка была удалена';
