import { body } from "express-validator";

const userRegistrationValidator = () => {
  return [
    body("email")
      .isEmail()
      .withMessage("Email is not valid")
      .trim()
      .notEmpty()
      .withMessage("Email is required"),
    body("password")
      .trim()
      .isLength({ min: 4 })
      .withMessage("password shoudl be at least 4 char")
      .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{4,}$/)
      .withMessage("Password must contain at least one uppercase and one degit")
      .notEmpty()
      .withMessage("password is required"),
    body("username")
      .trim()
      .notEmpty()
      .withMessage("User name is required")
      .isLength({ min: 3 })
      .withMessage("username must be at least 3 char")
      .isLength({ max: 13 })
      .withMessage("username cannot axceed 13 char"),
  ];
};

const userLoginValidator = () => {
  return [
    body("email")
      .isEmail()
      .withMessage("Email is not valid")
      .trim()
      .notEmpty()
      .withMessage("Email is required"),
    body("password").trim().isEmpty().withMessage("password is required"),
  ];
};

export { userRegistrationValidator, userLoginValidator };
