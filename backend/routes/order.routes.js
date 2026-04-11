const router = require("express").Router();
const {
  createOrder,
  updateOrder,
  deleteOrder,
  getUserOrders,
  getAllOrders,
  getMonthlyIncome,
  downloadInvoice,
} = require("../controllers/order.controller");
const { verifyToken, verifyTokenAndAdmin } = require("../middlewares/verifyToken");

router.post("/", verifyToken, createOrder);
router.put("/:id", verifyTokenAndAdmin, updateOrder);
router.delete("/:id", verifyTokenAndAdmin, deleteOrder);
router.get("/find/:userId", verifyToken, getUserOrders);
router.get("/", verifyTokenAndAdmin, getAllOrders);
router.get("/income", verifyTokenAndAdmin, getMonthlyIncome);
router.get("/invoice/:id", verifyToken, downloadInvoice);

module.exports = router;
