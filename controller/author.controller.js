import cloudinary from "../config/cloudinary.js";
import { CustomError } from "../errors/index.js";
import authorSchemas from "../schema/author.schema.js";
import { ResData } from "../utils/responseHelpers.js";

export const addAuthor = async (req, res, next) => {
  try {
    const body = req.body;

    await authorSchemas.create({ ...body });
    res.status(201).json({ message: "succses" });
  } catch (error) {
    next(error);
  }
};

export const addAuthorImage = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new CustomError(400, "Image not found");
    }
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "uploads",
    });
    const resData = new ResData(201, "succses", result.secure_url);
    res.status(resData.status).json(resData);
  } catch (error) {
    next(error);
  }
};

export const getAuthors = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const filter = {};
    if (category) {
      filter.category = category;
    }
    if (search) {
      filter.first_name = { $regex: search, $options: "i" };
    }
    const data = await authorSchemas.find(filter);
    const resData = new ResData(200, "succses", data);
    res.status(resData.status).json(resData);
  } catch (error) {
    next(error);
  }
};

export const getAuthorsOneId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await authorSchemas.find({ _id: id });
    const resData = new ResData(200, "succses", data);
    res.status(resData.status).json(resData);
  } catch (error) {
    next(error);
  }
};
