import Joi from 'joi';

export const registerUserSchema = Joi.object({
  name: Joi.string().min(3).max(32).required().messages({
    'string.base': 'Name must be a string',
    'string.min': 'Name should have a minimum length of 3',
    'string.max': 'Name should have a maximum length of 32',
    'any.required': 'Name is required',
  }),
  email: Joi.string().email().max(64).required().messages({
    'string.base': 'Email must be a string',
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(8).max(128).required().messages({
    'string.base': 'Password must be a string',
    'string.min': 'Password should have a minimum length of 8',
    'string.max': 'Password should have a maximum length of 128',
    'any.required': 'Password is required',
  }),
  // favorites: Joi.array()
  //   .items(Joi.string().hex().length(24)) 
  //   .optional(),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.base': 'Email must be a string',
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().required().messages({
    'string.base': 'Password must be a string',
    'any.required': 'Password is required',
  }),
});

export const requestResetEmailSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.base': 'Email must be a string',
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is required',
  }),
});

export const resetEmailSchema = Joi.object({
  newEmail: Joi.string().email().required().messages({
    'string.base': 'Email must be a string',
    'string.email': 'Email must be a valid email address',
    'any.required': 'Email is required',
  }),
  token: Joi.string().required().messages({
    'string.base': 'Token must be a string',
    'any.required': 'Token is required',
  }),
});
