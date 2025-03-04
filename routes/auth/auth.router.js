import { Router } from "express";
import {
  add_wishlist,
  changePassword,
  delete_wishlist,
  get_wishlist,
  signIn,
  signUp,
  uploadImage,
  veryifyRegister,
} from "../../controller/auth.controller.js";
import {
  changePasswordMiddleware,
  sendRgisterVerify,
  validateUserSignin,
  validateUserSignup,
} from "../../middleware/validator.middleware.js";
import { verifyMiddlewere } from "../../middleware/verifytoken.middleware.js";
import { upload } from "../../config/multer.js";
const router = Router();

router.post("/sign-up", validateUserSignup, signUp);
router.post("/sign-in", validateUserSignin, signIn);
router.post(
  "/upload-img",
  verifyMiddlewere,
  upload.single("image"),
  uploadImage
);
router.get("/wishlist/:like", verifyMiddlewere, get_wishlist);
router.post("/delete-wishlist", verifyMiddlewere, delete_wishlist);
router.post("/add-wishlist", verifyMiddlewere, add_wishlist);
router.post("/send-verify-register", sendRgisterVerify, veryifyRegister);
router.post(
  "/change-password",
  verifyMiddlewere,
  changePasswordMiddleware,
  changePassword
);
export { router };
