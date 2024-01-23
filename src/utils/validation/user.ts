import { IJwtUserSignature, IUser } from '../../types/user';

export function isValidUser(obj: any): obj is IUser {
  return typeof obj._id === 'string'
    && typeof obj.name === 'string'
    && typeof obj.about === 'string'
    && typeof obj.avatar === 'string'
    && typeof obj.email === 'string'
    && typeof obj.password === 'string'
    && (typeof obj.token === 'string' || obj.token === undefined)
    && (typeof obj.__v === 'number' || obj.__v === undefined);
}

export function isValidJwsUserSignature(obj: any): obj is IJwtUserSignature {
  const currentTimeInSeconds = Math.floor(Date.now() / 1000);
  return typeof obj._id === 'string'
    && typeof obj.iat === 'number'
    && typeof obj.exp === 'number'
    && obj.exp > currentTimeInSeconds;
}
