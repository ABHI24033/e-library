import express from "express";
import { AddBook, deleteBook, getAllBooks, getBookById, updateBook } from "./bookController";
import multer from "multer";
import path from "node:path";
import { Authenticate } from "../middleware/Authenticate";
// import { userLogin, userRegistration } from "./userController";

const upload = multer({
    dest: path.resolve(__dirname, "../../public/uploads"),
    limits: { fileSize: 3e7 }, //3e7 max-30mb
});

const bookRouter = express.Router();

bookRouter.post(
    "/add_book",
    // middlewares
    Authenticate,
    upload.fields([
        { name: "coverImage", maxCount: 1 },
        { name: "file", maxCount: 1 },
    ]),
    // controller
    AddBook
);

bookRouter.patch(
    "/update_book/:bookId",
    Authenticate,
    upload.fields([
        { name: "coverImage", maxCount: 1 },
        { name: "file", maxCount: 1 },
    ]),
    updateBook
);

bookRouter.get("/",getAllBooks);
bookRouter.get("/:id",getBookById);
bookRouter.delete("/delete_book/:id",Authenticate,deleteBook);

export default bookRouter;
