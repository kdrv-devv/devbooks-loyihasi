import { Router } from "express";
import {
  addAuthor,
  addAuthorImage,
  getAuthors,
  getAuthorsOneId,
} from "../../controller/author.controller.js";
import { validateAddAuthor } from "../../middleware/validator.middleware.js";
import { verifyMiddlewere } from "../../middleware/verifytoken.middleware.js";
import { upload } from "../../config/multer.js";
const router = Router();

router.post("/create-author", validateAddAuthor, addAuthor);

router.post(
  "/create-image",
  verifyMiddlewere,
  upload.single("image"),
  addAuthorImage
);
router.get("/get-authors", getAuthors);
router.get("/get-authors/:id", getAuthorsOneId);

export { router };
