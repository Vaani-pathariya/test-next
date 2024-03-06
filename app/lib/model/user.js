import  mongoose, { mongo }  from "mongoose";

const userModel = new mongoose.Schema({
    name : String , 
    phoneNo: Number,
    email: String,
    hobbies : String
})
export const User=mongoose.models.users || mongoose.model("users", userModel);