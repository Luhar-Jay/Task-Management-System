import { Router } from "express";
import {
  registerUser,
  userEmailVerification,
  userLogin,
  userLogOut,
  getProfile,
  refreshVerificationToken,
} from "../controllers/auth.controllers.js";
import { userRegistrationValidator } from "../validators/index.js";
import { validate } from "../middleware/validator.middleware.js";
import { emailverificationMailGenContent } from "../utils/mail.js";
import { logoutUser } from "../../../fullstack/controller/user.controller.js";
import { isLoggedIn } from "../middleware/isLoggedIn.middleware.js";
const router = Router();

router
  .route("/register")
  .post(validate, userRegistrationValidator(), registerUser);
router.route("/login").post(userLogin);
router.route("/verify/:token").post(userEmailVerification);
router.route("/logout").get(isLoggedIn, userLogOut);
router.route("/profile").get(isLoggedIn, getProfile);
router.route("/resent-verification").get(refreshVerificationToken);

export default router;
