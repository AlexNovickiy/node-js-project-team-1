// src/validation/stories.js
import Joi from 'joi';
import mongoose from 'mongoose';

// Joi валідатор для MongoDB ObjectId
const objectIdValidator = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error('any.invalid');
  }
  return value;
};

export const createStorySchema = Joi.object({
  title: Joi.string().max(80).required(),
  article: Joi.string().max(2500).required(),
  category: Joi.string()
    .custom(objectIdValidator, 'MongoDB ObjectId')
    .required(),
  // 'storyImage' валідується через 'multer'
});

export const updateStorySchema = Joi.object({
  title: Joi.string().max(80),
  article: Joi.string().max(2500),
  category: Joi.string().custom(objectIdValidator, 'MongoDB ObjectId'),
});
