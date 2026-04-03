const router = require("express").Router();
const { getStats } = require("../controllers/stats.controller");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");

router.get("/", verifyTokenAndAdmin, getStats);

module.exports = router;
