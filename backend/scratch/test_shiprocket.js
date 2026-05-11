require("dotenv").config();
const { getToken } = require("../services/shiprocketService");

async function testToken() {
    try {
        console.log("Attempting to get Shiprocket token...");
        const token = await getToken();
        console.log("✅ Shiprocket token generated successfully!");
    } catch (error) {
        console.error("❌ Failed to generate Shiprocket token.");
        console.error("Error:", error.message);
    }
}

testToken();
