import {NextResponse} from "next/server"
import mongoose from "mongoose"
import {User} from '@/app/lib/model/user'
require("dotenv").config(); 
export async function GET(){
    await mongoose.connect(process.env.MongoUri)
    const data = await User.find()
    return NextResponse.json(data)
}
export async function POST(request) {
    try {
      await mongoose.connect(process.env.MongoUri);
      const requestData = await request.json();
      // Assuming the request body contains the data to be saved
      const { name, phoneNo, email, hobbies } = requestData;
      // Create a new instance of the User model
      const newUser = new User({
        name,
        phoneNo,
        email,
        hobbies
      });
      
      // Save the new user to the database
      await newUser.save();
  
      return NextResponse.json({ success: true });
    } catch (error) {
      console.error('Error saving data:', error.message);
      return NextResponse.error(error.message);
    }
  }