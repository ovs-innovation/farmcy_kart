const axios = require("axios");

// Simple in-memory token cache
let tokenCache = {
  token: null,
  expiresAt: 0,
};

// STEP 2.1 — Get and Cache Shiprocket Token
async function getToken() {
  const now = Date.now();

  // Reuse token if not expired
  if (tokenCache.token && now < tokenCache.expiresAt) {
    return tokenCache.token;
  }

  try {
    const response = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/auth/login",
      {
        email: process.env.SHIPROCKET_EMAIL?.trim(),
        password: process.env.SHIPROCKET_PASSWORD?.trim(),
      }
    );

    const token = response.data.token;

    // Shiprocket tokens typically expire ~60 min → we set 50 min for safety
    tokenCache = {
      token,
      expiresAt: now + 50 * 60 * 1000,
    };

    return token;
  } catch (error) {
    console.error(
      "Error generating Shiprocket token:",
      error.response?.data || error
    );
    throw new Error("Failed to generate Shiprocket token");
  }
}

// STEP 2.2 — Reusable Axios Instance
async function shiprocketRequest(method, url, data = {}) {
  const token = await getToken();

  try {
    const config = {
      method,
      url: `https://apiv2.shiprocket.in/${url}`,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    // Only include data for POST, PUT, PATCH requests
    if (["post", "put", "patch"].includes(method.toLowerCase())) {
      config.data = data;
    }

    const response = await axios(config);

    return response.data;
  } catch (error) {
    console.error("Shiprocket API Error:", error.response?.data || error);
    throw new Error(
      error.response?.data?.message || "Shiprocket API request failed"
    );
  }
}

// STEP 2.3 — Export helper functions for next steps
module.exports = {
  getToken,
  shiprocketRequest,
};


