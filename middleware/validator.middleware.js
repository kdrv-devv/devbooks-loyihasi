import {
  userValidatorSchema,
  loginValidatorSchema,
  veryifyRegisterSchema,
  changePasswordSchema,
} from "../validator/user.validator.js";
import { CustomError } from "../errors/index.js";
import { addBookValidatorSchema } from "../validator/book.validator.js";
import { authorValidatorSchema } from "../validator/auhtor.validator.js";

const validateUserSignup = (req, res, next) => {
  try {
    const { error } = userValidatorSchema.validate(req.body);
    if (error) {
      throw new CustomError(400, error.details[0].message);
    }
    next();
  } catch (error) {
    next(error);
  }
};
const validateUserSignin = (req, res, next) => {
  try {
    const { error } = loginValidatorSchema.validate(req.body);
    if (error) {
      throw new CustomError(400, error.details[0].message);
    }
    next();
  } catch (error) {
    next(error);
  }
};
const validateAddBooks = (req, res, next) => {
  try {
    const { error } = addBookValidatorSchema.validate(req.body);
    if (error) {
      throw new CustomError(400, error.details[0].message);
    }
    next();
  } catch (error) {
    next(error);
  }
};
const validateAddAuthor = (req, res, next) => {
  try {
    const { error } = authorValidatorSchema.validate(req.body);
    if (error) {
      throw new CustomError(400, error.details[0].message);
    }
    next();
  } catch (error) {
    next(error);
  }
};
const sendRgisterVerify = (req, res, next) => {
  try {
    const { error } = veryifyRegisterSchema.validate(req.body);
    if (error) {
      throw new CustomError(400, error.details[0].message);
    }
    next();
  } catch (error) {
    next(error);
  }
};
const changePasswordMiddleware = (req, res, next) => {
  try {
    const { error } = changePasswordSchema.validate(req.body);
    if (error) {
      throw new CustomError(400, error.details[0].message);
    }
    next();
  } catch (error) {
    next(error);
  }
};
export {
  validateUserSignup,
  validateUserSignin,
  validateAddBooks,
  validateAddAuthor,
  sendRgisterVerify,
  changePasswordMiddleware,
};
