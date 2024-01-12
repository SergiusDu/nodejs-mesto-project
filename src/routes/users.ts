import {Request, Response, Router} from 'express';
import {createUser} from '../controllers/users';

const users = Router();
export default users.post('/', createUser)