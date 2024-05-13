import { NextFunction, Request, Response } from "express";

export const AddBook=async(req:Request,res:Response,next:NextFunction)=>{
    // const {title,author,description,price,image}=req.body;
    console.log(req.files);
    

    res.send("Book created");
}