const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/review.controller");
const { verifyToken } = require("../middlewares/verifyToken");

// Add product review
router.post("/product/:id", verifyToken, reviewController.addProductReview);

// Add site review
router.post("/site", verifyToken, reviewController.addSiteReview);

// Get all site reviews (public)
router.get("/site", reviewController.getSiteReviews);

module.exports = router;
