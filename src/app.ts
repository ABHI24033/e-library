import express from "express";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import userRouter from "./user/userRouter";
import bookRouter from "./book/bookRouter";
import cors from "cors";
import { config } from "./config/config";

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(globalErrorHandler);
app.use(cors({
  origin:config.frontendUrl,
}))

app.use("/api/user", userRouter);
app.use("/api/books", bookRouter);
// routes
// 

export default app;
