const router = require("express").Router();
const { subscribeNewsletter } = require("../controllers/newsletter.controller");

router.post("/", subscribeNewsletter);

module.exports = router;
