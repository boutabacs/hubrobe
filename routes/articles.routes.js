const router = require("express").Router();
const { getArticles, getArticleById, createArticle, deleteArticle, updateArticle } = require("../controllers/articles.controller");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");

router.get("/", getArticles);
router.get("/:id", getArticleById);
router.post("/", verifyTokenAndAdmin, createArticle);
router.put("/:id", verifyTokenAndAdmin, updateArticle);
router.delete("/:id", verifyTokenAndAdmin, deleteArticle);

module.exports = router;
