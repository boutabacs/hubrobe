const router = require("express").Router();
const { subscribeNewsletter, getSubscribers, sendNewsletter } = require("../controllers/newsletter.controller");
const { verifyTokenAndAdmin } = require("../middlewares/verifyToken");

router.post("/", subscribeNewsletter);
router.get("/", verifyTokenAndAdmin, getSubscribers);
router.post("/send", verifyTokenAndAdmin, sendNewsletter);

module.exports = router;
