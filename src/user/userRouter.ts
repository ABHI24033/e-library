import express from "express";
import { userLogin, userRegistration } from "./userController";

const userRouter=express.Router();

userRouter.post("/register",userRegistration);
userRouter.post("/login",userLogin);

export default userRouter;