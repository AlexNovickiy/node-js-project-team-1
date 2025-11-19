import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import handlebars from 'handlebars';
import createHttpError from 'http-errors';
import jwt from 'jsonwebtoken';
import fs from 'node:fs/promises';
import path from 'node:path';
import {
  FIFTEEN_MINUTES,
  TEMPLATES_DIR,
  THIRTY_DAYS,
} from '../constants/index.js';
import { SessionsCollection } from '../db/models/session.js';
import { UsersCollection } from '../db/models/user.js';
import { createActionToken } from '../utils/createActionToken.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import {
  getFullNameFromGoogleTokenPayload,
  validateCode,
} from '../utils/googleOAuth2.js';
import { sendEmail } from '../utils/sendMail.js';

export const registerUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email });
  if (user) throw createHttpError(409, 'Email in use');

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  const newUser = await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
  });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  const session = await SessionsCollection.create({
    userId: newUser._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  });

  return { user: newUser, session };
};

export const loginUser = async (payload) => {
  const user = await UsersCollection.findOne({ email: payload.email }).populate(
    {
      path: 'favorites',
      populate: [
        { path: 'category' },
        { path: 'ownerId', select: 'name, avatarUrl, description' },
      ],
    },
  );
  if (!user) {
    throw createHttpError(401, 'User not found');
  }
  const isEqual = await bcrypt.compare(payload.password, user.password);

  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized');
  }

  await SessionsCollection.deleteOne({ userId: user._id });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  const session = await SessionsCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  });
  return { session, user };
};

export const logoutUser = async (sessionId) => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  };
};

export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  const newSession = createSession();

  await SessionsCollection.deleteOne({ _id: sessionId, refreshToken });

  return await SessionsCollection.create({
    userId: session.userId,
    ...newSession,
  });
};

export const requestResetToken = async (email) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const resetToken = createActionToken(user, 'reset-password');
  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );
  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();
  const template = handlebars.compile(templateSource);

  const html = template({
    name: user.name,
    link: `${getEnvVar('APP_DOMAIN')}/auth/reset-pwd?token=${resetToken}`,
  });

  await sendEmail({
    from: getEnvVar('API_BREVO_FROM'),
    to: email,
    subject: 'Скидання пароля',
    html,
  });
};
export const resetPassword = async (payload) => {
  let decoded;

  try {
    decoded = jwt.verify(payload.token, getEnvVar('JWT_SECRET'));
  } catch (err) {
    if (err instanceof Error) throw createHttpError(401, err.message);
    throw err;
  }

  if (decoded.type !== 'reset-password') {
    throw createHttpError(400, 'Invalid token type');
  }

  const user = await UsersCollection.findOne({
    _id: decoded.sub,
    email: decoded.email,
  });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await UsersCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );
};
export const requestChangeEmailToken = async (oldEmail, newEmail) => {
  const user = await UsersCollection.findOne({ email: oldEmail });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const existing = await UsersCollection.findOne({ email: newEmail });
  if (existing) {
    throw createHttpError(409, 'Email already in use');
  }

  const token = createActionToken(user, 'reset-email');

  const templatePath = path.join(TEMPLATES_DIR, 'reset-email.html');
  const templateSource = (await fs.readFile(templatePath)).toString();
  const template = handlebars.compile(templateSource);

  const html = template({
    name: user.name,
    newEmail,
    link: `${getEnvVar(
      'APP_DOMAIN',
    )}/user-edit/confirm-email?token=${token}&newEmail=${encodeURIComponent(
      newEmail,
    )}`,
  });

  await sendEmail({
    from: getEnvVar('API_BREVO_FROM'),
    to: oldEmail,
    subject: 'Confirm your email change',
    html,
  });
};

export const confirmEmailChange = async (payload) => {
  let decoded;

  try {
    decoded = jwt.verify(payload.token, getEnvVar('JWT_SECRET'));
  } catch (err) {
    if (err instanceof Error) throw createHttpError(401, err.message);
    throw err;
  }

  if (decoded.type !== 'reset-email') {
    throw createHttpError(400, 'Invalid token type');
  }

  const user = await UsersCollection.findOne({
    _id: decoded.sub,
    email: decoded.email,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  if (!payload.newEmail) {
    throw createHttpError(400, 'New email is required');
  }

  const existing = await UsersCollection.findOne({ email: payload.newEmail });
  if (existing) {
    throw createHttpError(409, 'Email already in use');
  }

  const updatedUser = await UsersCollection.findOneAndUpdate(
    { _id: user._id },
    { email: payload.newEmail },
    { new: true },
  ).populate({
    path: 'favorites',
    populate: [
      { path: 'category' },
      { path: 'ownerId', select: 'name avatarUrl description' },
    ],
  });

  return updatedUser;
};
export const loginOrSignupWithGoogle = async (code) => {
  const loginTicket = await validateCode(code);
  const payload = loginTicket.getPayload();

  if (!payload) {
    throw createHttpError(401, 'Invalid Google token');
  }

  let user = await UsersCollection.findOne({ email: payload.email }).populate({
    path: 'favorites',
    populate: [
      { path: 'category', select: 'name' },
      { path: 'ownerId', select: 'name' },
    ],
  });

  if (!user) {
    const password = await bcrypt.hash(randomBytes(10).toString('hex'), 10);

    user = await UsersCollection.create({
      email: payload.email,
      name: getFullNameFromGoogleTokenPayload(payload),
      avatarURL: payload.picture || null,
      password,
      role: 'parent',
    });

    user = await UsersCollection.findById(user._id).populate({
      path: 'favorites',
      populate: [
        { path: 'category', select: 'name' },
        { path: 'ownerId', select: 'name, avatarUrl, description' },
      ],
    });
  } else {
    const updatedData = {};
    const fullName = getFullNameFromGoogleTokenPayload(payload);

    if (fullName && fullName !== user.name) {
      updatedData.name = fullName;
    }

    if (payload.picture && payload.picture !== user.avatarURL) {
      updatedData.avatarURL = payload.picture;
    }

    if (Object.keys(updatedData).length > 0) {
      user = await UsersCollection.findByIdAndUpdate(user._id, updatedData, {
        new: true,
      }).populate({
        path: 'favorites',
        populate: [
          { path: 'category', select: 'name' },
          { path: 'ownerId', select: 'name, avatarUrl, description' },
        ],
      });
    }
  }

  await SessionsCollection.deleteOne({ userId: user._id });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  const session = await SessionsCollection.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  });

  return { session, user };
};
