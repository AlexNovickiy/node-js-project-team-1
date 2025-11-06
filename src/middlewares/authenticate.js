// src/middlewares/authenticate.js
import { HttpError } from '../utils/HttpError.js';
import { Session } from '../db/models/session.js';
import { User } from '../db/models/user.js';

const ACCESS_COOKIE_NAME = 'accessToken';

export const authenticate = async (req, res, next) => {
  try {
    const accessToken = req.cookies[ACCESS_COOKIE_NAME];
    if (!accessToken) {
      throw HttpError(401, 'Not authorized');
    }

    const session = await Session.findOne({ accessToken }).populate('userId');
    if (!session) {
      throw HttpError(401, 'Not authorized');
    }

    if (new Date() > new Date(session.accessTokenValidUntil)) {
      throw HttpError(401, 'Access token expired');
    }

    req.user = session.userId;
    next();
  } catch (err) {
    next(err);
  }
};
