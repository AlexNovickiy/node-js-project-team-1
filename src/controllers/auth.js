import { FIFTEEN_MINUTES, THIRTY_DAYS } from '../constants/index.js';
import {
  confirmEmailChange,
  loginOrSignupWithGoogle,
  loginUser,
  logoutUser,
  refreshUsersSession,
  registerUser,
  requestChangeEmailToken,
  requestResetToken,
  resetPassword,
} from '../services/auth.js';
import { generateAuthUrl } from '../utils/googleOAuth2.js';

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
export const registerController = async (req, res, next) => {
  try {
    const { user, session } = await registerUser(req.body);

    setupAuthCookies(res, session);

    res.status(201).json({
      status: 201,
      message: 'User registered successfully',
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const loginController = async (req, res, next) => {
  try {
    const { session, user } = await loginUser(req.body);
    setupAuthCookies(res, session);

    res.status(200).json({
      status: 200,
      message: 'User logged in successfully',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
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
    message: 'Reset password email was successfully sent',
    status: 200,
    data: {},
  });
};
export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);
  res.json({
    message: 'Password was successfully reset!',
    status: 200,
    data: {},
  });
};
export const requestChangeEmailController = async (req, res) => {
  const oldEmail = req.user.email;
  const { newEmail } = req.body;

  await requestChangeEmailToken(oldEmail, newEmail);

  res.json({
    message:
      'Confirmation email was successfully sent to your current address!',
    status: 200,
    data: {},
  });
};

export const confirmEmailChangeController = async (req, res) => {
  await confirmEmailChange(req.body);
  res.json({
    message: 'Email was successfully changed!',
    status: 200,
    data: {},
  });
};

export const loginWithGoogleController = async (req, res, next) => {
  try {
    const { session, user } = await loginOrSignupWithGoogle(req.body.code);
    setupAuthCookies(res, session);

    res.status(200).json({
      status: 200,
      message: 'User logged in successfully via Google OAuth',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};
export const getGoogleOAuthUrlController = async (req, res) => {
  const url = generateAuthUrl();

  res.status(200).json({
    status: 200,
    message: 'Successfully retrieved Google OAuth URL',
    data: { url },
  });
};
