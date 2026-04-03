const Newsletter = require("../models/newsletter.model");
const Coupon = require("../models/coupon.model");

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

    res.status(201).json({ message: "Successfully subscribed", alreadySubscribed: false });
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  subscribeNewsletter,
};
