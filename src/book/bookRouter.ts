import express from "express";
import { AddBook } from "./bookController";
// import { userLogin, userRegistration } from "./userController";

const bookRouter=express.Router();

bookRouter.post("/add_book",AddBook);

export default bookRouter;