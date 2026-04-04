const Newsletter = require("../models/newsletter.model");
const Coupon = require("../models/coupon.model");
const sendMail = require("../config/mail");

// SUBSCRIBE
const subscribeNewsletter = async (req, res) => {
  const { email } = req.body;
  try {
    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return res.status(200).json({ message: "Already subscribed", alreadySubscribed: true });
    }
    const newSubscriber = new Newsletter({ email });
    await newSubscriber.save();

    // Ensure WELCOME20 coupon exists
    const welcomeCoupon = await Coupon.findOne({ code: "WELCOME20" });
    if (!welcomeCoupon) {
      const newCoupon = new Coupon({
        code: "WELCOME20",
        discount: 20,
        discountType: "percentage",
        expiryDate: new Date(new Date().setFullYear(new Date().getFullYear() + 10)), // 10 years
        isActive: true,
      });
      await newCoupon.save();
    }

    // Send Welcome Email
    try {
      await sendMail(
        email,
        "Welcome to hubrobe.",
        `<h1>Welcome to our Newsletter!</h1><p>Thank you for subscribing. Use code <b>WELCOME20</b> to get 20% off your first order!</p>`
      );
    } catch (mailErr) {
      console.error("Welcome email failed:", mailErr);
    }

    res.status(201).json({ message: "Successfully subscribed", alreadySubscribed: false });
  } catch (err) {
    res.status(500).json(err);
  }
};

// GET ALL SUBSCRIBERS
const getSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ createdAt: -1 });
    res.status(200).json(subscribers);
  } catch (err) {
    res.status(500).json(err);
  }
};

// SEND MANUAL NEWSLETTER
const sendNewsletter = async (req, res) => {
  const { subject, content } = req.body;
  try {
    const subscribers = await Newsletter.find();
    const emails = subscribers.map((s) => s.email);

    if (emails.length === 0) {
      return res.status(200).json("No subscribers found.");
    }

    // Send to all subscribers
    await Promise.all(
      emails.map((email) => sendMail(email, subject, content))
    );

    res.status(200).json("Newsletter sent successfully!");
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  subscribeNewsletter,
  getSubscribers,
  sendNewsletter,
};
