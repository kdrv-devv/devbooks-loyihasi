import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { CustomError } from "./errors/index.js";
import { ResData } from "./utils/responseHelpers.js";
import { connectDB } from "./database/db.connect.js";
import { router } from "./routes/router.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const PORT = process.env.PORT || 7070;
app.use("/api", router);

app.use((req, res, next) => {
  try {
    throw new CustomError(404, `This ${req.url} page not found`);
  } catch (error) {
    next(error);
  }
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  const resData = new ResData(statusCode, error.message);
  res.status(resData.status).json(resData);
});

app.listen(PORT, () => {
  connectDB();
  console.log(`Server started: http://localhost:${PORT}`);
});
