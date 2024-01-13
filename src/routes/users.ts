import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';
import { createUser } from '../controllers/users';

const users = Router();
export default users.post('/', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(200).required(),
    avatar: Joi.string().uri().required(),
  }),
}), createUser);
