const router = require("express").Router();
const { getFaq } = require("../controllers/faq.controller");

router.get("/", getFaq);

module.exports = router;

