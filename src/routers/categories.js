// src/routers/categories.js
import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { getCategoriesController } from '../controllers/categories.js';

const categoriesRouter = Router();

// Зазвичай категорії доступні всім
categoriesRouter.get('/', ctrlWrapper(getCategoriesController));

export default categoriesRouter;
