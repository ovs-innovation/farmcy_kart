const express = require("express");
const router = express.Router();

const {
  createShiprocketOrder,
  checkCourierServiceability,
  assignCourierAndGenerateAWB,
  generateShippingLabel,
  requestPickup,
  trackShipment,
  cancelShipment,
  linkShipmentToOrder,
  generateInvoice,
} = require("../controller/shiprocketController");

// STEP 3 — Create Shiprocket Order (Route)
router.post("/create-order", createShiprocketOrder);

// STEP 4.1 — Check Courier Serviceability
router.post("/courier/serviceability", checkCourierServiceability);

// STEP 4.2 — Assign Courier & Generate AWB
router.post("/courier/assign-awb", assignCourierAndGenerateAWB);

// STEP 5 — Generate Shipping Label (PDF)
router.get("/courier/generate-label", generateShippingLabel);

// STEP 6 — Request Pickup
router.post("/courier/request-pickup", requestPickup);

// STEP 7 — Track Shipment
router.get("/courier/track/:awb_code", trackShipment);

// Cancel Shipment
router.post("/courier/cancel", cancelShipment);

// Link Shipment ID to Order
router.post("/courier/link-shipment", linkShipmentToOrder);

// Generate order invoice from Shiprocket
router.get("/order/invoice", generateInvoice);

const { handleShiprocketWebhook } = require("../controller/shiprocketWebhookController");

// Webhook for Shiprocket updates
router.post("/webhook", handleShiprocketWebhook);

module.exports = router;


