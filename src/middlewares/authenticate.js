// src/middlewares/authenticate.js
import createHttpError from 'http-errors';
import { SessionsCollection } from '../db/models/session.js';

const ACCESS_COOKIE_NAME = 'accessToken';

export const authenticate = async (req, res, next) => {
  try {
    const accessToken = req.cookies[ACCESS_COOKIE_NAME];
    if (!accessToken) {
      throw createHttpError(401, 'Not authorized');
    }

    const session = await SessionsCollection.findOne({ accessToken }).populate(
      'userId',
    );
    if (!session) {
      throw createHttpError(401, 'Not authorized');
    }

    if (new Date() > new Date(session.accessTokenValidUntil)) {
      throw createHttpError(401, 'Access token expired');
    }

    req.user = session.userId;
    next();
  } catch (err) {
    next(err);
  }
};
