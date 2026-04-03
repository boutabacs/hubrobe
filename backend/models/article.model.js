const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    desc: { type: String, required: true },
    content: { type: String, required: true },
    img: { type: String, required: true },
    date: { type: String, default: () => new Date().toLocaleDateString() },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    author: { type: String, default: "Admin" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Article", ArticleSchema);
