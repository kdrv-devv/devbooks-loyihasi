import { Schema, model } from "mongoose";
import { LiteraturePeriod } from "../utils/enum.js";

const bookSchmea = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    pages: {
      type: Number,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: Object.values(LiteraturePeriod),
      required: true,
    },
    rate: {
      type: Number,
      max: 5,
      required: true,
      default: 0,
    },
    ganre: {
      type: String,
      required: true,
    },
    publisher: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

const bookSchmeas = model("Book", bookSchmea);
export default bookSchmeas;
