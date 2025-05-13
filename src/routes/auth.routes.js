import { Router } from "express";
import {
  registerUser,
  userEmailVerification,
  userLogin,
  userLogOut,
  getProfile,
  resendVerificationEmail,
  refreshAccessToken,
  forgotPasswordRequest,
  changeCurrentPassword,
} from "../controllers/auth.controllers.js";
import { userRegistrationValidator } from "../validators/index.js";
import { validate } from "../middleware/validator.middleware.js";
import { isLoggedIn } from "../middleware/isLoggedIn.middleware.js";
const router = Router();

router
  .route("/register")
  .post(validate, userRegistrationValidator(), registerUser);
router.route("/login").post(userLogin);
router.route("/verify/:token").post(userEmailVerification);
router.route("/logout").get(isLoggedIn, userLogOut);
router.route("/profile").get(isLoggedIn, getProfile);
router.route("/resent-verification").get(resendVerificationEmail);
router.route("/refresh-token").post(isLoggedIn, refreshAccessToken);
router.route("/forgot-password").post(forgotPasswordRequest);
router.route("/rest-password/:token").post(changeCurrentPassword);

export default router;
