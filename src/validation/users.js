import Joi from 'joi';

export const updateUserFavoritesSchema = Joi.object({
  storyId: Joi.string().custom((value, helper) => {
    if (value && !isValidObjectId(value)) {
      return helper.message('User id should be a valid mongo id');
    }
    return true;
  }),
});

export const updateUserSchema = Joi.object({
  userPhoto: Joi.string().optional(),
  description: Joi.string().max(150).optional(),
});
