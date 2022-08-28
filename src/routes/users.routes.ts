import { Router } from 'express';

import multer from "multer";
import { MULTER } from "../config/uploads";

import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';
import { UsersController } from '../controllers/UsersController';
import { UserAvatarController } from '../controllers/UserAvatarController';

const usersRoutes = Router();
const upload = multer(MULTER);

const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

usersRoutes.post('/', usersController.create);
usersRoutes.put('/', ensureAuthenticated, usersController.update);
usersRoutes.patch('/avatar', ensureAuthenticated, upload.single("avatar"), userAvatarController.update);

export { usersRoutes };