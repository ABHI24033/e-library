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
  const user = await usermodel.findOne({ email });
  if (user) {
    const error = createHttpError(400, "User is already registered");
    return next(error);
  }
  // password hashing
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await usermodel.create({
    name,
    email,
    password: hashedPassword,
  });
  // generate token
  const token = sign({sub:newUser?._id },config.jwtSecretKey as string, {expiresIn:"7d"});

  // process
  // responce
  res.json({ accessToken:token });
};
