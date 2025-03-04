import cloudinary from "../config/cloudinary.js";
import { CustomError } from "../errors/index.js";
import bookSchmeas from "../schema/book.schema.js";
import { ResData } from "../utils/responseHelpers.js";

export const addBooks = async (req, res, next) => {
  try {
    const body = req.body;
    await bookSchmeas.create({ ...body });
    res.status(201).json({ message: "succses" });
  } catch (error) {
    next(error);
  }
};

export const bookImgUpload = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new CustomError(400, "Image must be");
    }
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "uploads",
    });
    res.status(201).json({ message: "succses", image: result.secure_url });
  } catch (error) {
    next(error);
  }
};

export const getBooks = async (req, res, next) => {
  try {
    const { search, category } = req.query;
    let filter = {};
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }
    if (category) {
      filter.category = category;
    }
    const data = await bookSchmeas.find(filter);
    const resData = new ResData(200, "succses", data);
    res.status(resData.status).json(resData);
  } catch (error) {
    next(error);
  }
};

export const getBookOne = async (req, res, next) => {
  try {
    const data = await bookSchmeas.findOne({ _id: req.params.id });
    const resData = new ResData(200, "succses", data);
    res.status(resData.status).json(resData);
  } catch (error) {
    next(error);
  }
};
