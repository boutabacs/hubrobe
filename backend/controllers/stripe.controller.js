const stripe = require("stripe")(process.env.STRIPE_KEY);
const Order = require("../models/order.model");

const createPaymentIntent = async (req, res) => {
  const { amount, currency = "usd", orderId } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amount in cents
      currency,
      metadata: { orderId },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const handleWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata.orderId;
      
      try {
        await Order.findByIdAndUpdate(orderId, {
          paymentStatus: "paid",
          paymentIntentId: paymentIntent.id,
          status: "processing",
        });
        console.log(`Order ${orderId} updated to paid status.`);
      } catch (err) {
        console.error(`Error updating order ${orderId}:`, err.message);
      }
      break;
    
    case "payment_intent.payment_failed":
      const failedIntent = event.data.object;
      const failedOrderId = failedIntent.metadata.orderId;
      try {
        await Order.findByIdAndUpdate(failedOrderId, {
          paymentStatus: "failed",
          status: "cancelled",
        });
        console.log(`Order ${failedOrderId} updated to failed status.`);
      } catch (err) {
        console.error(`Error updating order ${failedOrderId}:`, err.message);
      }
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

module.exports = {
  createPaymentIntent,
  handleWebhook,
};
