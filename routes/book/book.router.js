import { Router } from "express";
import { verifyMiddlewere } from "../../middleware/verifytoken.middleware.js";
import {
  addBooks,
  bookImgUpload,
  getBookOne,
  getBooks,
} from "../../controller/book.controller.js";
import { validateAddBooks } from "../../middleware/validator.middleware.js";
import { upload } from "../../config/multer.js";
const router = Router();

router.post("/create", verifyMiddlewere, validateAddBooks, addBooks);
router.post(
  "/upload-img",
  verifyMiddlewere,
  upload.single("image"),
  bookImgUpload
);
router.get("/all-books", getBooks);
router.get("/all-books/:id", getBookOne);

export { router };
