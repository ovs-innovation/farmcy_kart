const axios = require("axios");
require("dotenv").config();

/**
 * Utility to send SMS/WhatsApp notifications via MSG91 Flow API.
 * @param {string} to - The recipient's phone number (with country code, e.g., 919999999999)
 * @param {string} message - Fallback message string (if not using template variables)
 * @param {object} variables - Variables for the MSG91 Flow template (e.g., { name: 'John', order_id: '123' })
 */
const sendSMS = async (to, message, variables = {}) => {
  try {
    const authKey = process.env.MSG91_AUTH_KEY;
    const templateId = process.env.MSG91_TEMPLATE_ID;
    const senderId = process.env.MSG91_SENDER_ID || "FARMCY";

    if (!authKey || !templateId) {
      console.warn("MSG91_AUTH_KEY or MSG91_TEMPLATE_ID not found in .env. Skipping SMS.");
      return false;
    }

    // Ensure 'to' has country code (MSG91 requires it, default to 91 if 10 digits)
    let mobile = to.replace(/\D/g, "");
    if (mobile.length === 10) {
      mobile = "91" + mobile;
    }

    const payload = {
      template_id: templateId,
      sender: senderId,
      short_url: "1",
      recipients: [
        {
          mobiles: mobile,
          ...variables,
          // If no variables provided, we try to pass the message as 'message' 
          // in case the template has a single ##message## variable
          ...(Object.keys(variables).length === 0 ? { message: message } : {})
        }
      ]
    };

    const response = await axios.post("https://api.msg91.com/api/v5/flow/", payload, {
      headers: {
        "authkey": authKey,
        "content-type": "application/json"
      }
    });

    if (response.data && response.data.type === "success") {
      // console.log(`[MSG91] Notification sent successfully to ${mobile}`);
      return true;
    } else {
      console.error("[MSG91] Error response:", response.data);
      return false;
    }
  } catch (error) {
    console.error("[MSG91] SMS sending failed:", error.response ? error.response.data : error.message);
    return false;
  }
};

module.exports = { sendSMS };
