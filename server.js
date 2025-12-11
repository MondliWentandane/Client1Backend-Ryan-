const express = require("express");
const { Resend } = require("resend");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Middleware
app.use(cors());
app.use(express.json());

// API endpoint to send email
app.post("/api/send-email", async (req, res) => {
  try {
    const { name, surname, email, cellno, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        error: "Name, email, and message are required" 
      });
    }

    console.log(`Attempting to send email from ${email}`);

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: "Construction Contact Form <onboarding@resend.dev>", // Use Resend's test domain for now
      to: ["mondli46401@gmail.com"], // Your email
      subject: `New Request from a Client`,
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
      reply_to: email, // Customer can reply directly to their email
    });

    if (error) {
      console.error("Resend error:", error);
      return res.status(500).json({ 
        success: false, 
        error: "Failed to send email" 
      });
    }

    console.log(`Email sent successfully! ID: ${data.id}`);
    
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

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ status: "Backend is running with Resend" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});