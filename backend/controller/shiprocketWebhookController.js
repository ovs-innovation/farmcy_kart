const Order = require("../models/Order");
const { syncShiprocketTracking } = require("../services/shiprocketSyncService");

/**
 * Handles incoming webhooks from Shiprocket.
 * Route: POST /api/webhooks/shiprocket
 */
const handleShiprocketWebhook = async (req, res) => {
  try {
    // Verify x-api-key if token is set in env
    const webhookToken = process.env.SHIPROCKET_WEBHOOK_TOKEN;
    const incomingToken = req.headers["x-api-key"];

    if (webhookToken && incomingToken !== webhookToken) {
      console.warn("Shiprocket Webhook: Unauthorized access attempt with invalid token.");
      return res.status(401).send({ message: "Unauthorized: Invalid API Key" });
    }

    const payload = req.body;
    console.log("Shiprocket Webhook Received:", JSON.stringify(payload, null, 2));

    // Shiprocket webhooks can send multiple types of data
    // We primarily care about tracking updates which usually have 'awb' or 'shipment_id'
    const awb = payload.awb || payload.awb_code;
    const shipmentId = payload.shipment_id;
    const externalOrderId = payload.order_id; // This should be our MongoDB Order ID

    if (!awb && !shipmentId) {
      return res.status(400).send({ message: "Invalid webhook payload: No AWB or Shipment ID" });
    }

    // Find the order in our database
    let order = null;
    
    if (externalOrderId) {
      // Best way: find by our internal ID
      order = await Order.findById(externalOrderId);
    }
    
    if (!order && awb) {
      // Fallback: find by AWB code
      order = await Order.findOne({ "shiprocket.awb_code": awb });
    }

    if (!order && shipmentId) {
      // Fallback: find by Shipment ID
      order = await Order.findOne({ "shiprocket.shipment_id": shipmentId });
    }

    if (!order) {
      console.warn(`Shiprocket Webhook: Order not found for AWB ${awb} / Shipment ${shipmentId} / ExtOrder ${externalOrderId}`);
      // We still return 200 to Shiprocket to acknowledge receipt
      return res.status(200).send({ message: "Order not found, but webhook acknowledged" });
    }

    // Sync the tracking data using our reusable service
    await syncShiprocketTracking(order._id, payload);

    res.status(200).send({ message: "Webhook processed successfully" });
  } catch (error) {
    console.error("Shiprocket Webhook Error:", error);
    // Shiprocket expects 200 even if we fail internally, to prevent retries of bad payloads
    // but here we can return 500 if it's a server error
    res.status(500).send({ message: error.message });
  }
};

const testWebhook = async (req, res) => {
  res.status(200).send({ success: true, message: "Shiprocket webhook endpoint active" });
};

module.exports = {
  handleShiprocketWebhook,
  testWebhook,
};
