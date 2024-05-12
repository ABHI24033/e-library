import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import usermodel from "./userModel";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
// import { sign } from "jsonwebtoken";

export const userRegistration = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password } = req.body;

  // validation
  if (!name || !email || !password) {
    const error = createHttpError(400, "All fields are required");
    return next(error);
  }
  // check user is alredy regisered or not
  try {
    const user = await usermodel.findOne({ email });
    if (user) {
      const error = createHttpError(400, "User is already registered");
      return next(error);
    }
  } catch (error) {
    return next(createHttpError(500, "Error while checking user existence"));
  }

  try {
    // password hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await usermodel.create({
      name,
      email,
      password: hashedPassword,
    });
    // generate token
    const token = sign({ sub: newUser?._id }, config.jwtSecretKey as string, {
      expiresIn: "7d",
    });
    res.status(201).json({ accessToken: token });
  } catch (error) {
    return next(createHttpError(500, "Error while creating user"));
  }
};

export const userLogin=async( 
    req: Request,
    res: Response,
    next: NextFunction
)=>{
    const {email,password}=req.body
    if(!email || !password){
        const error = createHttpError(400, "All fields are required");
        return next(error);
    }
    try {
        const user = await usermodel.findOne({ email });    
        if (!user) {
            const error = createHttpError(404, "User is not registered");
            return next(error);
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            const error = createHttpError(401, "Invalid credentials");
            return next(error);
        }
        const token = sign({ sub: user?._id }, config.jwtSecretKey as string, {
            expiresIn: "7d",
        });
        res.status(200).json({ accessToken: token });

    }catch(error){
        return next(createHttpError(500, "Error while logging in"));
    }
}
