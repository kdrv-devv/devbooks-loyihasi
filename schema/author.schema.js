import { Schema, model } from "mongoose";
import { LiteraturePeriod } from "../utils/enum.js";
const authorSchema = new Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    date_of_birth: {
      type: String,
      required: true,
    },
    date_of_deeth: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    creativity: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: Object.values(LiteraturePeriod),
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

const authorSchemas = model("Author", authorSchema);
export default authorSchemas;
