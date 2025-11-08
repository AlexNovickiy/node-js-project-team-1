import jwt from 'jsonwebtoken';
import { getEnvVar } from './getEnvVar.js';

export const createActionToken = (user, type) => {
  return jwt.sign(
    {
      sub: user._id,
      email: user.email,
      type, // 'reset-password' або 'reset-email'
    },
    getEnvVar('JWT_SECRET'),
    { expiresIn: '15m' },
  );
};
