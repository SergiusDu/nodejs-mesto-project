import { Router } from 'express';
import { createUser, login } from '../controllers/users';
import { USER_SIGNIN_ROUTE, USER_SIGNUP_ROUTE } from '../constants/user';
import { VALIDATE_SIGNIN, VALIDATE_SIGNUP } from '../utils/validation/auth';

const userAuthRouter = Router();

userAuthRouter.post(
  USER_SIGNIN_ROUTE,
  VALIDATE_SIGNIN,
  login,
);

userAuthRouter.post(
  USER_SIGNUP_ROUTE,
  VALIDATE_SIGNUP,
  createUser,
);

export default userAuthRouter;
