import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

export const isValidId = (paramName) => (req, res, next) => {
  const id = req.params[paramName];
  if (!isValidObjectId(id)) {
    throw createHttpError(400, 'Bad Request');
  }

  next();
};
