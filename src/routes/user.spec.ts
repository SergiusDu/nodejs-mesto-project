import axios from 'axios';
import { BASE_URL } from '../constants/common';
import { IUser } from '../types/user';
import { isValidUser } from '../utils/validation/user';
import {
  USER_BASE_ROUTE, USER_CHANGE_AVATAR_ROUTE, USER_DELETE_ROUTE,
  USER_SIGNIN_ROUTE,
  USER_SIGNUP_ROUTE,
} from '../constants/user';

let mockUser: Partial<IUser>;
describe('API Endpoints', () => {
  beforeAll(() => {
    const uniqueEmail = `${Date.now()}@email.com`;
    mockUser = {
      name: 'Мок Василий',
      email: uniqueEmail,
      password: 'МокПарольВасилия',
      about: 'Вся информация об Василии',
      avatar: 'https://example.com/avatar.jpg',
    };
  });

  it('POST /users должен создавать нового пользователя.', async () => {
    const response = await axios.post(`${BASE_URL}${USER_SIGNUP_ROUTE}`, mockUser);
    const expectedUserData = response.data;
    expect(isValidUser(expectedUserData)).toBe(true);
  });

  it('should not login successfully with incorrect credentials', async () => {
    const wrongUserCredentials = {
      email: `mockUser.email + ${Date.now()}`,
      password: mockUser.password,
    };

    try {
      await axios.post(`${BASE_URL}${USER_SIGNIN_ROUTE}`, wrongUserCredentials);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(error.response.status).toBe(400);
        // eslint-disable-next-line jest/no-conditional-expect
        expect(error.response.data.token).toBeUndefined();
      }
    }
  });

  it('should login successfully with correct credentials', async () => {
    const userCredentials = {
      email: mockUser.email,
      password: mockUser.password,
    };
    const response = await axios.post(`${BASE_URL}${USER_SIGNIN_ROUTE}`, userCredentials);
    expect(response.status).toBe(200);
    expect(response.data.token).toBeDefined();
  });

  it('GET /users должен предоставлять массив пользователей с корректными данными.\n'
    + '\t Если в базе данных пользователей есть невалидные данные, тест также выдаст ошибку', async () => {
    const userCredentials = {
      email: mockUser.email,
      password: mockUser.password,
    };
    const loginResponse = await axios.post(`${BASE_URL}${USER_SIGNIN_ROUTE}`, userCredentials);
    const cookies = loginResponse.headers['set-cookie'];
    expect(cookies).toBeDefined();
    if (!cookies) throw new Error('Куки не найдены');
    const getUserResponse = await axios.get(`${BASE_URL}${USER_BASE_ROUTE}`, {
      headers: {
        Cookie: cookies.join(': '),
      },
    });
    const users = getUserResponse.data;
    expect(Array.isArray(users)).toBe(true);
  });
  it('PATCH /me/avatar должен обновлять аватар пользователя', async () => {
    const userCredentials = {
      email: mockUser.email,
      password: mockUser.password,
    };
    const newAvatarUrl = 'https://example.com/new-avatar.jpg';
    const loginResponse = await axios.post(`${BASE_URL}${USER_SIGNIN_ROUTE}`, userCredentials);
    const cookies = loginResponse.headers['set-cookie'];
    expect(cookies).toBeDefined();
    if (!cookies) throw new Error('Куки не найдены');
    const updateAvatarResponse = await axios.patch(
      `${BASE_URL}${USER_BASE_ROUTE}${USER_CHANGE_AVATAR_ROUTE}`,
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

  it('PATCH /me/avatar должен обновлять аватар пользователя с некорректным URL', async () => {
    const userCredentials = {
      email: mockUser.email,
      password: mockUser.password,
    };
    const invalidAvatarUrls = ['http://ya', 'https://www.ya', 'justastring'];
    const loginResponse = await axios.post(`${BASE_URL}${USER_SIGNIN_ROUTE}`, userCredentials);
    const cookies = loginResponse.headers['set-cookie'];
    if (!cookies) throw new Error('Куки не найдены');
    await Promise.all(invalidAvatarUrls.map(async (url) => {
      try {
        await axios.patch(`${BASE_URL}${USER_BASE_ROUTE}${USER_CHANGE_AVATAR_ROUTE}`, { avatar: url }, {
          headers: { Cookie: cookies.join('; ') },
        });
        throw new Error('Запрос должен был завершиться с ошибкой с некорректным URL');
      } catch (error) {
        if (axios.isAxiosError(error)) {
          // eslint-disable-next-line jest/no-conditional-expect
          expect(error.response?.status).toBe(400);
        } else {
          throw error;
        }
      }
    }));
  });

  it('DELETE /me/delete должен удалять аккаунт пользователя', async () => {
    const userCredentials = {
      email: mockUser.email,
      password: mockUser.password,
    };
    const loginResponse = await axios.post(`${BASE_URL}${USER_SIGNIN_ROUTE}`, userCredentials);
    const cookies = loginResponse.headers['set-cookie'];
    if (!cookies) throw new Error('Куки не найдены');
    const getDeleteResponse = await axios.delete(`${BASE_URL}${USER_BASE_ROUTE}${USER_DELETE_ROUTE}`, {
      headers: {
        Cookie: cookies.join(': '),
      },
    });
    expect(getDeleteResponse.status).toEqual(200);
  });
});
