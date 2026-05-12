const express = require("express");
const router = express.Router();
const { handleShiprocketWebhook, testWebhook } = require("../controller/shiprocketWebhookController");

// Shiprocket Webhook
router.get("/shiprocket", testWebhook);
router.post("/shiprocket", handleShiprocketWebhook);

module.exports = router;
