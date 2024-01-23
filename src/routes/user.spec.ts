import axios from 'axios';
import { BASE_URL } from '../constants/common';
import { IUser } from '../types/user';
import { isValidUser } from '../utils/validation/user';
import {
  USER_BASE_ROUTE,
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
        expect(error.response.status).toBe(400);
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
});
