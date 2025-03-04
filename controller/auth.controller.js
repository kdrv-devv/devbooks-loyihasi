import cloudinary from "../config/cloudinary.js";
import { sendSmsVerify } from "../config/mailer.js";
import { CustomError } from "../errors/index.js";
import authorSchemas from "../schema/author.schema.js";
import bookSchmeas from "../schema/book.schema.js";
import userSchemas from "../schema/user.schema.js";
import { hashPassword, signInJwt } from "../utils/jwt.js";
import { ResData } from "../utils/responseHelpers.js";
import bcrypt from "bcrypt";

export const signUp = async (req, res, next) => {
  try {
    const body = req.body;
    const email = await userSchemas.findOne({ email: body.email });
    if (email) {
      throw new CustomError(400, "Email already exsist");
    }

    const password = await hashPassword(body.password);
    let data = await userSchemas.create({ ...body, password });

    await sendSmsVerify({ to: data.email });
    const resData = new ResData(
      200,
      "Verification code sent. Please verify your email."
    );
    res.status(resData.status).json(resData);
  } catch (error) {
    next(error);
  }
};

export const veryifyRegister = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await userSchemas.findOne({ email });
    if (!user || user.verifyCode !== password)
      throw new CustomError(400, "Invalid verification code");
    if (Date.now() > user.verifyExpires)
      throw new CustomError(400, "Verification code expired");

    let data = await userSchemas.findOneAndUpdate(
      { email },
      { $set: { verify: true, verifyCode: null, verifyExpires: 0 } },
      { new: true }
    );
    const resData = new ResData(201, "Email verified successfully", data);
    res.status(resData.status).json(resData);
  } catch (error) {
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const body = req.body;
    const user = await userSchemas.findOne({ email: body.email });
    if (!user) {
      throw new CustomError(400, "Email or password wrong !");
    }
    const isMatchPassword = await bcrypt.compare(body.password, user.password);
    if (!isMatchPassword) {
      throw new CustomError(400, "Email or password wrong !");
    }
    const token = signInJwt({ id: user._id });
    const resData = new ResData(200, "succses", { user, token });
    res.status(resData.status).json(resData);
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { current_password, new_password } = req.body;
    const user = await userSchemas.findOne({ _id: req.userId });
    const isMatchPassword = await bcrypt.compare(
      current_password,
      user.password
    );

    if (!isMatchPassword) {
      throw new CustomError(400, "Current password wrong");
    }
    const new_password2 = await hashPassword(new_password);
    await userSchemas.updateOne(
      { _id: req.userId },
      { $set: { password: new_password2 } }
    );
    res.status(203).json({ message: "succses" });
  } catch (error) {
    next(error);
  }
};

export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new CustomError(400, "Image must be");
    }
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "uploads",
    });
    await userSchemas.updateOne(
      { _id: req.userId },
      { $set: { image: result.secure_url } }
    );
    res.status(201).json({ message: "succses" });
  } catch (error) {
    next(error);
  }
};

export const get_wishlist = async (req, res, next) => {
  try {
    const { like } = req.params;
    if (like !== "books" && like !== "authors") {
      throw new CustomError(400, "Like must be author or books");
    }

    let data = [];
    const user = await userSchemas.findOne({ _id: req.userId });
    if (like === "books") {
      for (const value of user.wishlist_books) {
        data.push(await bookSchmeas.find({ _id: value }));
      }
    }
    if (like === "authors") {
      for (const value of user.wishlist_authors) {
        data.push(await authorSchemas.find({ _id: value }));
      }
    }
    const resData = new ResData(201, "succses", data);
    res.status(resData.status).json(resData);
  } catch (error) {
    next(error);
  }
};

export const delete_wishlist = async (req, res, next) => {
  try {
    const { _id, type } = req.body;
    if (type !== "books" && type !== "authors") {
      throw new CustomError(400, "Type must be author or books");
    }
    if (!_id) {
      throw new CustomError(400, "_id must be");
    }
    const user = await userSchemas.findOne({ _id: req.userId });
    if (type === "books") {
      let deleteWishlist = user.wishlist_books.filter((value) => value !== _id);
      await userSchemas.updateOne(
        { _id: req.userId },
        { $set: { wishlist_books: deleteWishlist } }
      );
    }
    if (type === "authors") {
      let deleteWishlist = user.wishlist_authors.filter(
        (value) => value !== _id
      );
      await userSchemas.updateOne(
        { _id: req.userId },
        { $set: { wishlist_authors: deleteWishlist } }
      );
    }
    res.status(201).json({ message: "succses" });
  } catch (error) {
    next(error);
  }
};

export const add_wishlist = async (req, res, next) => {
  try {
    const { _id, type } = req.body;
    if (type !== "books" && type !== "authors") {
      throw new CustomError(400, "Type must be author or books");
    }
    if (!_id) {
      throw new CustomError(400, "_id must be");
    }

    let user = await userSchemas.findOne({ _id: req.userId });
    if (type === "books") {
      if (user.wishlist_books.includes(_id)) {
        throw new CustomError(400, "This books already exist");
      }

      await userSchemas.updateOne(
        { _id: req.userId },
        { $set: { wishlist_books: [...user.wishlist_books, _id] } }
      );
    }
    if (type === "authors") {
      if (user.wishlist_authors.includes(_id)) {
        throw new CustomError(400, "This books already exist");
      }
      await userSchemas.updateOne(
        { _id: req.userId },
        { $set: { wishlist_authors: [...user.wishlist_authors, _id] } }
      );
    }
    res.status(201).json({ message: "succses" });
  } catch (error) {
    next(error);
  }
};
