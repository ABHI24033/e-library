import express from "express";
import { userRegistration } from "./userController";

const userRouter=express.Router();

userRouter.post("/register",userRegistration);

export default userRouter;