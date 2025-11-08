import { FIFTEEN_MINUTES, THIRTY_DAYS } from '../constants/index.js';
import {
  loginUser,
  logoutUser,
  refreshUsersSession,
  registerUser,
  requestResetToken,
} from '../services/auth.js';

const REFRESH_COOKIE_NAME = 'refreshToken';
const ACCESS_COOKIE_NAME = 'accessToken';
const SESSION_COOKIE_NAME = 'sessionId';

const setupAuthCookies = (res, session) => {
  res.cookie(REFRESH_COOKIE_NAME, session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });

  res.cookie(ACCESS_COOKIE_NAME, session.accessToken, {
    httpOnly: true,
    expires: new Date(Date.now() + FIFTEEN_MINUTES),
  });

  res.cookie(SESSION_COOKIE_NAME, session._id.toString(), {
    httpOnly: true,
    expires: new Date(Date.now() + THIRTY_DAYS),
  });
};

// --- Контролери ---

export const registerController = async (req, res) => {
  const user = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'User registered successfully',
    data: { user },
  });
};

export const loginController = async (req, res) => {
  const session = await loginUser(req.body);
  setupAuthCookies(res, session);

  res.status(200).json({
    status: 200,
    message: 'User logged in successfully',
  });
};

export const logoutController = async (req, res) => {
  if (req.cookies.sessionId) {
    await logoutUser(req.cookies.sessionId);
  }

  res.clearCookie(SESSION_COOKIE_NAME);
  res.clearCookie(REFRESH_COOKIE_NAME);
  res.clearCookie(ACCESS_COOKIE_NAME);
  res.status(204).send();
};

export const refreshController = async (req, res) => {
  const session = await refreshUsersSession({
    sessionId: req.cookies.sessionId,
    refreshToken: req.cookies.refreshToken,
  });

  setupAuthCookies(res, session);

  res.status(200).json({
    status: 200,
    message: 'Session refreshed successfully',
  });
};

export const requestResetEmailController = async (req, res) => {
  await requestResetToken(req.body.email);
  res.json({
    message: 'Reset password email was successfully sent!',
    status: 200,
    data: {},
  });
};

// export const resetEmailController = async (req, res) => {
//   await resetEmail(req.body);

//   res.clearCookie(SESSION_COOKIE_NAME);
//   res.clearCookie(REFRESH_COOKIE_NAME);
//   res.clearCookie(ACCESS_COOKIE_NAME);

//   res.json({
//     message: 'Email was successfully reset!',
//     status: 200,
//     data: {},
//   });
// };
