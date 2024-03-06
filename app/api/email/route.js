import nodemailer from "nodemailer";
const { ObjectId } = require("mongodb");
import mongoose from "mongoose"
import { NextResponse } from "next/server"; 
import { User } from "@/app/lib/model/user";
require("dotenv").config(); 
// Create a transporter object for sending emails
const transporter = nodemailer.createTransport({
  // Configure the email sending service
  // Example configuration for Gmail SMTP
  service: "gmail",
  auth: {
    user: process.env.user,
    pass: process.env.pass,
  },
});

export async function POST(request) {
  try {
    await mongoose.connect(process.env.MongoUri);

    // Parse the request body to get the selectedRows array
    const { selectedRows } = await request.json();

    // Fetch user data for each selected row
    const userData = [];
    for (const id of selectedRows) {
      const iter = new ObjectId(id);
      const user = await User.findById(iter);
      if (user) {
        userData.push(user);
      }
    }

    // Prepare email message
    const emailContent = userData
      .map(
        (user) => `
      Name: ${user.name}
      Phone Number: ${user.phoneNo}
      Email: ${user.email}
      Hobbies: ${user.hobbies}
      -------------------------------
    `
      )
      .join("");

    // Send email
    await transporter.sendMail({
      from: process.env.user,
      to: "info@redpositive.in",
      subject: "User Data",
      text: emailContent,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error.message);
    return NextResponse.error(error.message);
  }
}
