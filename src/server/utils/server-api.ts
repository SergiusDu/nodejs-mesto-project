export const mongooseMinLimitsDescriber = (minValue: number, fieldName: string) : [number, string] => [minValue, `Минимальная длина поля "${fieldName}" - ${minValue}`];
export const mongooseMaxLimitsDescriber = (maxValue: number, fieldName: string) : [number, string] => [maxValue, `Максимальная длина поля "${fieldName}" - ${maxValue}`];
export const mongooseRequiredFieldDescriber = (fieldName: string) : [boolean, string] => [true, `Поле "${fieldName}" является обязательным`];
