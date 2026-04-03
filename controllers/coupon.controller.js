const Coupon = require("../models/coupon.model");
const Order = require("../models/order.model");

// CREATE COUPON
const createCoupon = async (req, res) => {
  const newCoupon = new Coupon(req.body);
  try {
    const savedCoupon = await newCoupon.save();
    res.status(200).json(savedCoupon);
  } catch (err) {
    res.status(500).json(err);
  }
};

// GET ALL COUPONS
const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json(coupons);
  } catch (err) {
    res.status(500).json(err);
  }
};

// UPDATE COUPON
const updateCoupon = async (req, res) => {
  try {
    const updatedCoupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedCoupon);
  } catch (err) {
    res.status(500).json(err);
  }
};

// DELETE COUPON
const deleteCoupon = async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.status(200).json("Coupon has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
};

// VALIDATE COUPON
const validateCoupon = async (req, res) => {
  const code = req.params.code.toUpperCase();
  const userId = req.query.userId;
  const email = req.query.email;
  
  try {
    const coupon = await Coupon.findOne({ 
      code: code, 
      isActive: true,
      expiryDate: { $gte: new Date() }
    });
    
    if (!coupon) {
      return res.status(404).json("Invalid or expired coupon code.");
    }

    // Check if user has already used this coupon (by userId or email)
    if (userId || email) {
      const query = { couponCode: code };
      if (userId) query.userId = userId;
      if (email) query["address.email"] = email;

      const existingOrder = await Order.findOne(query);
      if (existingOrder) {
        return res.status(400).json("This coupon has already been used with this account or email.");
      }
    }

    res.status(200).json(coupon);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
};