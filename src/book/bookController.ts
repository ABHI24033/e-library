import { NextFunction, Request, Response } from "express";

export const AddBook=async(req:Request,res:Response,next:NextFunction)=>{
    res.send("Book created");
}