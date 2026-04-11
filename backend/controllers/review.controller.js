const Product = require("../models/product.model");
const SiteReview = require("../models/siteReview.model");

// Add product review
const addProductReview = async (req, res) => {
  const { rating, comment, username } = req.body;
  const productId = req.params.id;

  try {
    const product = await Product.findById(productId);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.userId.toString() === req.user.id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json("Product already reviewed");
      }

      const review = {
        username: username || req.user.username,
        rating: Number(rating),
        comment,
        userId: req.user.id,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json("Review added");
    } else {
      res.status(404).json("Product not found");
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

// Add site review
const addSiteReview = async (req, res) => {
  const { rating, comment, username } = req.body;

  try {
    const newReview = new SiteReview({
      userId: req.user.id,
      username: username || req.user.username,
      rating: Number(rating),
      comment,
    });

    const savedReview = await newReview.save();
    res.status(201).json(savedReview);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Get all site reviews (for home page)
const getSiteReviews = async (req, res) => {
  try {
    const reviews = await SiteReview.find({ isApproved: true }).sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  addProductReview,
  addSiteReview,
  getSiteReviews,
};
