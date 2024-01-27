import axios from 'axios';
import { BASE_URL, RES_CREATED_CODE } from './constants/common';
import { IUser } from './types/user';
import {
  USER_BASE_ROUTE,
  USER_CHANGE_AVATAR_ENDPOINT,
  USER_DELETE_ENDPOINT,
  USER_ID_ENDPOINT,
  USER_PROFILE_ENDPOINT,
  USER_SIGNIN_ROUTE,
  USER_SIGNUP_ROUTE,
} from './constants/user';
import {
  ADD_LIKE_TO_CARD_ENDPOINT,
  CARD_BASE_ROUTE,
  DELETE_CARD_ENDPOINT,
  DELETE_LIKE_FROM_CARD_ENDPOINT,
} from './constants/card';

let mockUser: Partial<IUser>;
let cookies: string[];
let createdCardId: string;
describe('API Endpoints', () => {
  beforeAll(async () => {
    // Создание нового пользователя перед тестами
    const uniqueEmail = `test_${Date.now()}@email.com`;
    mockUser = {
      name: 'Тестовый Пользователь',
      email: uniqueEmail,
      password: 'ТестПароль',
      about: 'Тестовая информация о пользователе',
      avatar: 'https://example.com/avatar.jpg',
    };
    await axios.post(`${BASE_URL}${USER_SIGNUP_ROUTE}`, mockUser);
    // Авторизация пользователя для получения кук
    const loginResponse = await axios.post(`${BASE_URL}${USER_SIGNIN_ROUTE}`, {
      email: mockUser.email,
      password: mockUser.password,
    });
    mockUser._id = loginResponse.data.user._id;
    const loginCookies = loginResponse.headers['set-cookie'];
    if (!loginCookies) throw new Error('Не удалось получить куки при логине');
    cookies = loginCookies;
  });
  afterAll(async () => {
    // Удаление пользователя после всех тестов
    if (cookies) {
      await axios.delete(`${BASE_URL}${USER_DELETE_ENDPOINT}`, {
        headers: {
          Cookie: cookies.join('; '),
        },
      });
    }
  });
  it('POST /cards должен создавать новую карточку', async () => {
    const cardData = {
      name: 'Тестовая карточка',
      link: 'https://example.com/test-card.jpg',
    };
    const response = await axios.post(`${BASE_URL}${CARD_BASE_ROUTE}`, cardData, {
      headers: {
        Cookie: cookies.join('; '),
      },
    });
    expect(response.status).toBe(RES_CREATED_CODE);
    expect(response.data.name).toBe(cardData.name);
    createdCardId = response.data._id;
  });
  it('GET /cards должен возвращать массив карточек', async () => {
    const response = await axios.get(`${BASE_URL}${CARD_BASE_ROUTE}`, {
      headers: {
        Cookie: cookies.join('; '),
      },
    });
    expect(Array.isArray(response.data)).toBe(true);
  });
  it('PUT /cards/:cardId/likes должен добавлять лайк карточке', async () => {
    const response = await axios.put(`${BASE_URL}${ADD_LIKE_TO_CARD_ENDPOINT.replace(':cardId', createdCardId)}`, {}, {
      headers: {
        Cookie: cookies.join('; '),
      },
    });
    expect(response.status).toBe(200);
    expect(response.data.likes.includes(mockUser._id)).toBe(true);
  });
  it('DELETE /cards/:cardId/likes должен удалять лайк у карточки', async () => {
    const response = await axios.delete(`${BASE_URL}${DELETE_LIKE_FROM_CARD_ENDPOINT.replace(':cardId', createdCardId)}`, {
      headers: {
        Cookie: cookies.join('; '),
      },
    });
    expect(response.status).toBe(200);
    expect(response.data.likes.includes(mockUser._id)).toBe(false);
  });
  it('DELETE /cards/:cardId должен удалять карточку', async () => {
    const response = await axios.delete(`${BASE_URL}${DELETE_CARD_ENDPOINT.replace(':cardId', createdCardId)}`, {
      headers: {
        Cookie: cookies.join('; '),
      },
    });
    expect(response.status).toBe(200);
  });
  it(`GET ${USER_BASE_ROUTE} должен предоставлять массив пользователей с корректными данными.
`
    + '\t Если в базе данных пользователей есть невалидные данные, тест также выдаст ошибку', async () => {
    const getUserResponse = await axios.get(`${BASE_URL}${USER_BASE_ROUTE}`, {
      headers: {
        Cookie: cookies.join(': '),
      },
    });
    const users = getUserResponse.data;
    expect(Array.isArray(users)).toBe(true);
  });
  it(`GET ${USER_ID_ENDPOINT} должен возвращать пользователя по ID`, async () => {
    const getUserByIdResponse = await axios.get(`${BASE_URL}${USER_BASE_ROUTE}/${mockUser._id}`, {
      headers: {
        Cookie: cookies.join(': '),
      },
    });
    expect(getUserByIdResponse.status).toEqual(200);
  });
  it(`PATCH ${USER_PROFILE_ENDPOINT} должен обновлять профиль пользователя`, async () => {
    const userUpdateResponse = await axios.patch(
      `${BASE_URL}${USER_PROFILE_ENDPOINT}`,
      { avatar: 'https://example.com/new-avatar.jpg', name: 'Новое имя', about: 'Что-то новое о себе' },
      {
        headers: {
          Cookie: cookies.join('; '),
        },
      },
    );
    expect(userUpdateResponse.status).toBe(200);
  });
  it(`PATCH ${USER_CHANGE_AVATAR_ENDPOINT} должен обновлять аватар пользователя`, async () => {
    const newAvatarUrl = 'https://example.com/new-avatar.jpg';
    const updateAvatarResponse = await axios.patch(
      `${BASE_URL}${USER_CHANGE_AVATAR_ENDPOINT}`,
      { avatar: newAvatarUrl },
      {
        headers: {
          Cookie: cookies.join('; '),
        },
      },
    );
    expect(updateAvatarResponse.status).toBe(200);
    expect(updateAvatarResponse.data.avatar).toBe(newAvatarUrl);
  });
});
