const express = require("express");
const router = express.Router();
const stripeController = require("../controllers/stripe.controller");
const { verifyToken } = require("../middlewares/verifyToken");

// Payment Intent
router.post("/create-payment-intent", express.json(), verifyToken, stripeController.createPaymentIntent);

// Webhook - This needs raw body for signature verification
router.post("/webhook", express.raw({ type: "application/json" }), stripeController.handleWebhook);

module.exports = router;
