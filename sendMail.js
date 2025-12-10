//== Bellow I am importing the Nodemailer library.
/*= Also importing the dotenv fo that I can access the invironment variables inside this file.
    the config() will help attack the invironment variables in the .env file*/

const nodemailer = require("nodemailer");
require("dotenv").config();
const path = require("path");

const transporter = nodemailer.createTransport({
  service: "gmail",  
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.USER, //=== This is the senders gmail address
    pass: process.env.APP_PASSWORD,//== App password from Gmail account
  },
});

const mailOptions ={
    from: {name: "Mondli Khoza",
           address: process.env.USER
    },
    to: ["mondlik34@gmail.com"],
    subject: "Send email using nodemailer and gmail ✔",
    text: `Hi`, // plain‑text body
    html: `<b>Dear Miss Frank I hope this message finds you well. 
           Please find attached our completed Task 3.9 for your 
           review. https://docs.google.com/presentation/d/13EDBS</b>`, 
}

const sendEmail = async (transporter, mailOptions)=>{
    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email has been sent to ${mailOptions.to}`);
    } catch (error) {
        console.error(error)
    }
}

sendEmail(transporter, mailOptions);