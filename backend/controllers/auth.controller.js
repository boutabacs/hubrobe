const User = require("../models/user.model");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const { sendWelcomeEmail } = require("../services/email.service");

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

function escapeRegex(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// LOGIN — accepts username OR email (UI says "Username or email")
const login = async (req, res) => {
  try {
    const identifier = (req.body.username || "").trim();
    const plainPassword = req.body.password;

    if (!identifier || plainPassword === undefined || plainPassword === null) {
      return res.status(401).json("Wrong credentials!");
    }

    let user = await User.findOne({ username: identifier });
    if (!user && identifier.includes("@")) {
      user = await User.findOne({
        email: new RegExp(`^${escapeRegex(identifier)}$`, "i"),
      });
    }

    if (!user) {
      return res.status(401).json("Wrong credentials!");
    }

    const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    if (originalPassword !== plainPassword) {
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

module.exports = { register, login };
