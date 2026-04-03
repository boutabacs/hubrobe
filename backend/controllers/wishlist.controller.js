const Wishlist = require("../models/wishlist.model");

// CREATE OR UPDATE WISHLIST
const updateWishlist = async (req, res) => {
  try {
    const existingWishlist = await Wishlist.findOne({ userId: req.user.id });
    if (existingWishlist) {
      const updatedWishlist = await Wishlist.findOneAndUpdate(
        { userId: req.user.id },
        { $set: req.body },
        { new: true }
      );
      res.status(200).json(updatedWishlist);
    } else {
      const newWishlist = new Wishlist({
        userId: req.user.id,
        products: req.body.products,
      });
      const savedWishlist = await newWishlist.save();
      res.status(200).json(savedWishlist);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

// GET USER WISHLIST
const getUserWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.params.userId });
    res.status(200).json(wishlist);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = { updateWishlist, getUserWishlist };
