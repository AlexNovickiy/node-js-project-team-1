// src/routers/stories.js
import { Router } from 'express';
import {
  createStoryController,
  getStoriesController,
  getStoryByIdController,
  updateStoryController,
} from '../controllers/stories.js';
import { authenticate } from '../middlewares/authenticate.js';
import { isValidId } from '../middlewares/isValidId.js';
import { upload } from '../middlewares/multer.js';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { createStorySchema, updateStorySchema } from '../validation/stories.js';

const storiesRouter = Router();

// --- Публічні роути ---
// GET /stories - ОТРИМАННЯ історій + пагінація + фільтрація
storiesRouter.get('/', ctrlWrapper(getStoriesController));

storiesRouter.get(
  '/:storyId',
  isValidId('storyId'),
  ctrlWrapper(getStoryByIdController),
);

storiesRouter.use(authenticate);

// POST /api/stories - СТВОРЕННЯ історії
storiesRouter.post(
  '/',
  upload.single('storyImage'),
  validateBody(createStorySchema),
  ctrlWrapper(createStoryController),
);

// PATCH /api/stories/:storyId - РЕДАГУВАННЯ історії
storiesRouter.patch(
  '/:storyId',
  isValidId('storyId'),
  upload.single('storyImage'),
  validateBody(updateStorySchema),
  ctrlWrapper(updateStoryController),
);

export default storiesRouter;
