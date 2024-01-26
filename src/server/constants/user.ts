// Константы роутов
export const USER_BASE_ROUTE = '/users';
export const USER_SIGNIN_ROUTE = '/signin';
export const USER_SIGNUP_ROUTE = '/signup';
export const USER_PROFILE_ROUTE = '/me';
export const USER_ID_ROUTE = '/:userId';
export const USER_DELETE_ROUTE = `${USER_PROFILE_ROUTE}/delete`;

// Константы эндпоинтов
export const USER_ID_ENDPOINT = `${USER_BASE_ROUTE}${USER_ID_ROUTE}`;
export const USER_PROFILE_ENDPOINT = `${USER_BASE_ROUTE}${USER_PROFILE_ROUTE}`;
export const USER_CHANGE_AVATAR_ROUTE = `${USER_PROFILE_ROUTE}/avatar`;
export const USER_CHANGE_AVATAR_ENDPOINT = `${USER_BASE_ROUTE}${USER_CHANGE_AVATAR_ROUTE}`;
export const USER_DELETE_ENDPOINT = `${USER_BASE_ROUTE}${USER_DELETE_ROUTE}`;
// Константы имени полей
export const USER_ID_KEY = '_id';
export const USER_EMAIL_KEY = 'email';
export const USER_PASSWORD_KEY = 'password';
export const USER_NAME_KEY = 'name';
export const USER_ABOUT_KEY = 'about';
export const USER_MONGOOSE_MODEL_NAME = 'user';
// Остальные константы
export const USER_NAME_MIN_LENGTH = 2;
export const USER_NAME_MAX_LENGTH = 30;
export const USER_ABOUT_MIN_LENGTH = 2;
export const USER_ABOUT_MAX_LENGTH = 200;
export const USER_CHANGE_PARAMS_MIN_LENGTH = 1;
export const USER_PASSWORD_MIN_LENGTH = 6;
export const USER_EMAIL_MIN_LENGTH = 3;
export const USER_EMAIL_MAX_LENGTH = 30;
export const USER_DEFAULT_NAME = 'Жак-Ив Кусто';
export const USER_DEFAULT_ABOUT = 'Исследователь';
export const USER_DEFAULT_AVATAR = 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png';
