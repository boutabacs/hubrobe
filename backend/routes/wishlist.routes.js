const router = require("express").Router();
const { updateWishlist, getUserWishlist } = require("../controllers/wishlist.controller");
const {
  verifyToken,
  verifyTokenAndAuthorization,
} = require("../middlewares/verifyToken");

router.post("/", verifyToken, updateWishlist);
router.get("/find/:userId", verifyTokenAndAuthorization, getUserWishlist);

module.exports = router;
