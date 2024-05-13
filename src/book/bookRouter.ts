import express from "express";
import { AddBook } from "./bookController";
import multer from "multer";
import path from "node:path";
// import { userLogin, userRegistration } from "./userController";

const upload = multer({
  dest: path.resolve(__dirname, "../../public/uploads"),
  limits: { fileSize: 3e7 }, //3e7 max-30mb
});

const bookRouter = express.Router();

bookRouter.post("/add_book",
 upload.fields([
    { name: "coverImage", maxCount: 1 },
    {name:"file",maxCount:1}
]),
 AddBook);

export default bookRouter;
