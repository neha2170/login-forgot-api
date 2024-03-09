// File: routes/authRoutes.js

const express = require("express");
const router = express.Router();
const User = require("../models/User");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

// Route: /api/login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    // Check if the user exists
    const user = await User.findOne({ username });
    if (!user || !user.comparePassword(password)) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Route: /api/forgot-password
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a unique reset token and save it to the user document
    const resetToken = await generateResetToken();
    user.resetToken = resetToken;
    user.resetTokenExpiration = Date.now() + 3600000; // Token expires in 1 hour
    await user.save();
    const testmail = nodemailer.createTestAccount();
    //connect t smtp
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: "hayley.gislason@ethereal.email",
        pass: "TgqRBCSNMz2mG8Hydh",
      },
    });
    // Send an email with the reset token to the user
    const mailOptions = {
      from: '"Neha Verma" <vermaneha2170@gmail.com>',
      to: user.email,
      subject: "Password Reset",
      text: `Use this token to reset your password: ${resetToken}`,
    };

    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json({ message: "Password reset token sent to your email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/reset-password", async (req, res) => {
  const { resetToken, newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetToken: resetToken,
      resetTokenExpiration: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
function generateResetToken() {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(3, (err, buf) => {
      if (err) {
        reject(err);
      } else {
        const resetToken = parseInt(buf.toString("hex"), 16) % 1000000; // Ensure it is a 6-digit number
        resolve(resetToken);
      }
    });
  });
}

module.exports = router;
