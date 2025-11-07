// src/routers/users.js
import { Router } from 'express';
import {
  addFavoriteController,
  getCurrentUserController,
  getUserByIdController,
  getUsersController,
  removeFavoriteController,
  updateCurrentUserController,
} from '../controllers/users.js';
import { authenticate } from '../middlewares/authenticate.js';
import { isValidId } from '../middlewares/isValidId.js';
import { upload } from '../middlewares/multer.js';
import { validateBody } from '../middlewares/validateBody.js';
import { parsePagination } from '../middlewares/parsePagination.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  updateUserFavoritesSchema,
  updateUserSchema,
} from '../validation/users.js';

const usersRouter = Router();

// --- Публічні роути ---
// GET /api/users - отримання даних про користувачів(авторів) + пагінація
usersRouter.get('/', ctrlWrapper(getUsersController));

// GET /api/users/:userId - отримання даних про користувача за ID
usersRouter.get(
  '/:userId',
  isValidId('userId'),
  ctrlWrapper(getUserByIdController),
);

// --- Приватні роути ---
usersRouter.use(authenticate);

// GET /api/users/me - отримання інформації про поточного користувача
usersRouter.get('/me/current', parsePagination, ctrlWrapper(getCurrentUserController));

// PATCH /api/users/me - оновлення даних та аватару
usersRouter.patch(
  '/me',
  upload.single('avatar'),
  validateBody(updateUserSchema),
  ctrlWrapper(updateCurrentUserController),
);

// POST /api/users/me/favorites - додавання статті до збережених
usersRouter.post(
  '/me/favorites',
  validateBody(updateUserFavoritesSchema),
  ctrlWrapper(addFavoriteController),
);

// DELETE /api/users/me/favorites/:storyId - видалення статті зі збережених
usersRouter.delete(
  '/me/favorites/:storyId',
  isValidId('storyId'),
  ctrlWrapper(removeFavoriteController),
);

export default usersRouter;
