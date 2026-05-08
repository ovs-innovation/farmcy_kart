require("dotenv").config();

/**
 * Utility to send SMS notifications.
 * Replace with your specific provider (Twilio, MSG91, etc.)
 */
const sendSMS = async (to, message) => {
  try {
    // console.log(`[SMS] Sending to ${to}: ${message}`);

    // Example for a generic API provider
    /*
    const response = await axios.post(process.env.SMS_API_URL, {
      apiKey: process.env.SMS_API_KEY,
      to: to,
      message: message
    });
    return response.data;
    */

    // For now, we log it and return success if env is set
    if (!process.env.SMS_API_KEY) {
      // console.warn("SMS_API_KEY not found in .env, SMS will not be sent.");
      return false;
    }

    return true;
  } catch (error) {
    console.error("SMS sending failed:", error.message);
    return false;
  }
};

module.exports = { sendSMS };
