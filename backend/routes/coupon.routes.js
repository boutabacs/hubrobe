const router = require("express").Router();
const {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
} = require("../controllers/coupon.controller");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");

router.post("/", verifyTokenAndAdmin, createCoupon);
router.get("/", verifyTokenAndAdmin, getAllCoupons);
router.put("/:id", verifyTokenAndAdmin, updateCoupon);
router.delete("/:id", verifyTokenAndAdmin, deleteCoupon);
router.get("/validate/:code", validateCoupon);

module.exports = router;