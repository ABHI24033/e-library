import { Schema, model } from "mongoose";
import { bookTypes } from "./bookType";

const bookSchema=new Schema<bookTypes>({
    title:{
        type:String,
        required:true
    },
    author:{
        type:Schema.Types.ObjectId,
        required:true
    },
    genre:{
        type:String,
        required:true
    },
    coverImage:{
        type:String,
    },
    file:{
        type:String,
        required:true
    }

},{timestamps:true});

const bookModel=model<bookTypes>("Book",bookSchema);
export default bookModel;