import { NextFunction, Request, Response } from "express";
import {verify} from "jsonwebtoken";
import { config } from "../config/config";

export interface userInterface extends Request{
    userId:string
}

export const Authenticate=(req:Request,res:Response,next:NextFunction)=>{
    try {
        // const token=req.headers.authorization
        const token=req.header("Authorization");
        if(!token){
            return res.status(401).json({message:"Unauthorized : Token is required"})
        }
        const parsedToken=token.split(" ")[1];
        const decoded=verify(parsedToken,config?.jwtSecretKey as string);
        if(!decoded){
            return res.status(401).json({
                message:"Unauthorized"
            })
        }
        req.body.user=decoded
        const _req=req as userInterface
        _req.userId=decoded?.sub as string;
        // console.log("decoded",decoded);
        
        next();

    }
    catch (error) {
        return res.status(401).json({
            message:"Unauthorized"
        })
    }
}