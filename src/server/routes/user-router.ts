import { Router } from 'express';
import {
  deleteUser,
  getAllUsers,
  getProfileData,
  getUserById,
  modifyUser,
} from '../controllers/users';
import {
  USER_CHANGE_AVATAR_ROUTE,
  USER_DELETE_ROUTE,
  USER_ID_ROUTE,
  USER_PROFILE_ROUTE,
} from '../constants/user';
import {
  VALIDATE_GET_USER_BY_ID,
  VALIDATE_USER_AVATAR_PATCH,
  VALIDATE_USER_PROFILE_PATCH,
} from '../utils/validation/user';
import { ROOT_PATH } from '../constants/common';
import { VERIFY_AUTH_TOKEN_COOKIE } from '../utils/validation/common';

const userRouter = Router();
userRouter.get(
  USER_PROFILE_ROUTE,
  getProfileData,
);

userRouter.get(
  ROOT_PATH,
  VERIFY_AUTH_TOKEN_COOKIE,
  getAllUsers,
);

userRouter.get(
  USER_ID_ROUTE,
  VALIDATE_GET_USER_BY_ID,
  getUserById,
);

userRouter.patch(
  USER_PROFILE_ROUTE,
  VALIDATE_USER_PROFILE_PATCH,
  modifyUser,
);

userRouter.patch(
  USER_CHANGE_AVATAR_ROUTE,
  VALIDATE_USER_AVATAR_PATCH,
  modifyUser,
);

userRouter.delete(
  USER_DELETE_ROUTE,
  VERIFY_AUTH_TOKEN_COOKIE,
  deleteUser,
);

export default userRouter;
