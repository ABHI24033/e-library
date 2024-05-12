import { userType } from "../user/userType";

export interface bookTypes{
    _id:string,
    title:string,
    author:userType,
    genre:string,
    coverImage:string,
    file:string,
    
}