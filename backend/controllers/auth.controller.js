const User = require("../models/user.model");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const { sendResetPasswordEmail, sendWelcomeEmail } = require("../services/email.service");

function normalizeResetCode(code) {
  return String(code ?? "").replace(/\s/g, "");
}

// FORGOT PASSWORD — 6-digit code + page /reset-password to enter it
const forgotPassword = async (req, res) => {
  try {
    const email = (req.body.email || "").trim();
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json("User with this email does not exist!");
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    await User.findOneAndUpdate(
      { email },
      {
        resetPasswordCode: resetCode,
        resetPasswordExpires: Date.now() + 3600000,
        resetPasswordToken: undefined,
        resetPasswordExpire: undefined,
      },
      { returnDocument: "after", overwrite: false }
    );

    void sendResetPasswordEmail(email, resetCode).catch((mailErr) => {
      console.error("Reset password email failed:", mailErr.message);
    });

    res.status(200).json("Reset code sent to your email!");
  } catch (err) {
    console.error("Forgot Password Error:", err);
    res.status(500).json(err.message || "An error occurred during the password reset process.");
  }
};

// RESET PASSWORD — body: { email, code, newPassword }
const resetPassword = async (req, res) => {
  try {
    const email = (req.body.email || "").trim();
    const code = normalizeResetCode(req.body.code);
    const { newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json("Email, code, and new password are required.");
    }

    const user = await User.findOne({
      email,
      resetPasswordCode: code,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json("Invalid or expired reset code!");
    }

    const encryptedPassword = CryptoJS.AES.encrypt(newPassword, process.env.PASS_SEC).toString();

    await User.findOneAndUpdate(
      { _id: user._id },
      {
        $set: { password: encryptedPassword },
        $unset: {
          resetPasswordCode: "",
          resetPasswordExpires: "",
          resetPasswordToken: "",
          resetPasswordExpire: "",
        },
      },
      { returnDocument: "after" }
    );

    res.status(200).json("Password has been reset successfully!");
  } catch (err) {
    console.error("Reset Password Error:", err);
    res.status(500).json(err.message || "An error occurred.");
  }
};

// REGISTER
const register = async (req, res) => {
  const { username, email, password } = req.body;
  const newUser = new User({
    username,
    email,
    password: CryptoJS.AES.encrypt(password, process.env.PASS_SEC).toString(),
  });

  try {
    const savedUser = await newUser.save();

    sendWelcomeEmail(email, "WELCOME20").catch((err) =>
      console.error("Background welcome email failed:", err.message)
    );

    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json(err.message || "An error occurred.");
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(401).json("Wrong credentials!");
    }

    const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    if (originalPassword !== req.body.password) {
      return res.status(401).json("Wrong credentials!");
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: "3d" }
    );

    const { password, ...others } = user._doc;
    res.status(200).json({ ...others, accessToken });
  } catch (err) {
    res.status(500).json(err.message || "An error occurred.");
  }
};

module.exports = { register, login, forgotPassword, resetPassword };
