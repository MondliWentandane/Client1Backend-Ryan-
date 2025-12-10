const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allow frontend to make requests
app.use(express.json()); // Parse JSON request bodies

// Create transporter with updated config
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465, // Changed from 587 to 465
  secure: true, // Changed to true for port 465
  auth: {
    user: process.env.USER,
    pass: process.env.APP_PASSWORD,
  },
  // Add these options to help with Railway
  tls: {
    rejectUnauthorized: false
  },
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000,
  socketTimeout: 10000
});

// Test transporter connection on startup
transporter.verify(function(error, success) {
  if (error) {
    console.error("SMTP connection error:", error);
  } else {
    console.log("SMTP server is ready to send emails");
  }
});

// API endpoint to send email
app.post("/api/send-email", async (req, res) => {
  try {
    // Get data from frontend
    const { name, surname, email, cellno, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        error: "Name, email, and message are required" 
      });
    }

    console.log(`Attempting to send email from ${email}`);

    // Email to send to the construction company owner
    const mailOptions = {
      from: {
        name: "Construction Website Contact Form",
        address: process.env.USER
      },
      to: ["mondlik34@gmail.com"], // Your email (company owner)
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name} ${surname || ''}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Cell Number:</strong> ${cellno || 'Not provided'}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
        <hr>
        <p><em>This email was sent from your construction company website contact form.</em></p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    
    console.log(`Email sent successfully from ${email}`);
    
    res.status(200).json({ 
      success: true, 
      message: "Email sent successfully" 
    });

  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to send email. Please try again later." 
    });
  }
});

// Health check endpoint (useful for Railway)
app.get("/", (req, res) => {
  res.json({ status: "Backend is running" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});