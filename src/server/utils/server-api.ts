export const mongooseMinLimitsDescriber = (minValue: number, fieldName: string) : [number, string] => [minValue, `Минимальная длина поля "${fieldName}" - ${minValue}`];
export const mongooseMaxLimitsDescriber = (maxValue: number, fieldName: string) : [number, string] => [maxValue, `Максимальная длина поля "${fieldName}" - ${maxValue}`];
export const mongooseRequiredFieldDescriber = (fieldName: string) : [boolean, string] => [true, `Поле "${fieldName}" является обязательным`];

export const getJwtTokenFromCookies = (cookies: string | undefined) => {
  if (cookies) {
    const cookieArray = cookies.split(';');
    return cookieArray.find((cookie) => cookie.startsWith('jwt='))?.split('jwt=')[1];
  }
  return null;
};

export const getJwtTokenFromBearer = (bearerToken: string | undefined) => {
  if (bearerToken) {
    return bearerToken.split('Bearer ')[1];
  }
  return null;
};
