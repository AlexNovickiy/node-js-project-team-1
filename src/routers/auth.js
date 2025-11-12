import { Router } from 'express';

import {
  confirmEmailChangeController,
  getGoogleOAuthUrlController,
  loginController,
  loginWithGoogleController,
  logoutController,
  refreshController,
  registerController,
  requestChangeEmailController,
  requestResetEmailController,
  resetPasswordController,
} from '../controllers/auth.js';
import { authenticate } from '../middlewares/authenticate.js';
import { validateBody } from '../middlewares/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  confirmEmailChangeSchema,
  googleLoginSchema,
  loginUserSchema,
  registerUserSchema,
  requestChangeEmailSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
} from '../validation/auth.js';

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

authRouter.post(
  '/send-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController),
);

authRouter.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);

authRouter.post(
  '/send-change-email',
  authenticate,
  validateBody(requestChangeEmailSchema),
  ctrlWrapper(requestChangeEmailController),
);

authRouter.post(
  '/confirm-email',
  validateBody(confirmEmailChangeSchema),
  ctrlWrapper(confirmEmailChangeController),
);
authRouter.post(
  '/login/google',
  validateBody(googleLoginSchema),
  ctrlWrapper(loginWithGoogleController),
);
authRouter.get('/get-oauth-url', ctrlWrapper(getGoogleOAuthUrlController));
export default authRouter;
