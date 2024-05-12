import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import usermodel from "./userModel";

export const userRegistration = async(req:Request, res:Response,next:NextFunction) => {
    const {name,email,password}=req.body;

    // validation
    if(!name || !email ||!password){
        const error=createHttpError(400,"All fields are required");
        return next(error);
    }
    // check user is alredy regisered or not
    const user=await usermodel.findOne({email});
    if(user){
        const error=createHttpError(400,"User is already registered");
        return next(error);
    }
    
    // process
    // responce
  res.send("User registerd");
};
