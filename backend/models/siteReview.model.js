const mongoose = require("mongoose");

const SiteReviewSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    username: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    isApproved: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SiteReview", SiteReviewSchema);
