import express from "express";
import { globalErrorHandler } from "./middleware/globalErrorHandler";
import createHttpError from "http-errors";
import userRouter from "./user/userRouter";
import bookRouter from "./book/bookRouter";

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(globalErrorHandler);

app.use("/api/user", userRouter);
app.use("/api/books", bookRouter);
// routes
app.get("/", (req, res) => {
    const stayus = createHttpError(400, "Something went wrong");
    throw stayus;
    res.send("Hello World!");
});

export default app;
