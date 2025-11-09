// src/routers/categories.js
import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  getCategoriesController,
  getCategoryById,
} from '../controllers/categories.js';

const categoriesRouter = Router();

// Зазвичай категорії доступні всім
categoriesRouter.get('/', ctrlWrapper(getCategoriesController));
categoriesRouter.get('/:categoryId', ctrlWrapper(getCategoryById));

export default categoriesRouter;
