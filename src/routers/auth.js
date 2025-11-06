import { Router } from 'express';

import {
  loginController,
  logoutController,
  refreshController,
  registerController,
} from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { loginUserSchema, registerUserSchema } from '../validation/auth.js';

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerController),
);

authRouter.post(
  '/login',
  validateBody(loginUserSchema),
  ctrlWrapper(loginController),
);

authRouter.post('/logout', ctrlWrapper(logoutController));

authRouter.post('/refresh', ctrlWrapper(refreshController));

// authRouter.post(
//   '/send-reset-email',
//   validateBody(requestResetEmailSchema),
//   ctrlWrapper(requestResetEmailController),
// );

// authRouter.post(
//   '/reset-pwd',
//   validateBody(resetPasswordSchema),
//   ctrlWrapper(resetPasswordController),
// );

// authRouter.get('/get-oauth-url', ctrlWrapper(getGoogleOAuthUrlController));

// authRouter.post(
//   '/confirm-oauth',
//   validateBody(loginWithGoogleOAuthSchema),
//   ctrlWrapper(loginWithGoogleController),
// );

export default authRouter;
