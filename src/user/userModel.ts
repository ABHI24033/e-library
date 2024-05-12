import { Schema, model } from "mongoose";
import { userType } from "./userType";

const userSchema= new Schema<userType>({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
},{timestamps:true});

const usermodel= model("User",userSchema);

export default usermodel;