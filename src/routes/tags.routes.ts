import { Router } from 'express';
import { TagsController } from '../controllers/TagsController';
import { ensureAuthenticated } from '../middlewares/ensureAuthenticated';

const tagsRoutes = Router();

const tagsController = new TagsController();

tagsRoutes.get('/', ensureAuthenticated, tagsController.index);

export { tagsRoutes };