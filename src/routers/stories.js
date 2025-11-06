// src/routers/stories.js
import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { authenticate } from '../middlewares/authenticate.js';
import { isValidId } from '../middlewares/isValidId.js';
import { validateBody } from '../middlewares/validateBody.js';
import { upload } from '../middlewares/multer.js';
import { createStorySchema, updateStorySchema } from '../validation/stories.js';
import {
  getStoriesController,
  createStoryController,
  updateStoryController,
  // ... (додайте інші контролери)
} from '../controllers/stories.js';

const storiesRouter = Router();

// --- Публічні роути ---
// GET /api/stories - ОТРИМАННЯ історій + пагінація + фільтрація
storiesRouter.get('/', ctrlWrapper(getStoriesController));

// --- Приватні роути ---
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

// (Тут можна додати DELETE, якщо потрібно за ТЗ)

export default storiesRouter;
