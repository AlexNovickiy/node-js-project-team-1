// src/controllers/categories.js
import { CategoriesCollection } from '../db/models/category.js';

export const getCategoriesController = async (req, res) => {
  const data = await CategoriesCollection.find();
  res.status(200).json({ status: 200, data });
};
