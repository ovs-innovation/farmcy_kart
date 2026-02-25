const express = require("express");
const router = express.Router();
const {
  loginCustomer,
  loginWithPhone,
  registerCustomer,
  registerCustomerDirect,
  verifyPhoneNumber,
  signUpWithProvider,
  signUpWithOauthProvider,
  verifyEmailAddress,
  forgetPassword,
  changePassword,
  resetPassword,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  addAllCustomers,
  addShippingAddress,
  getShippingAddress,
  updateShippingAddress,
  deleteShippingAddress,
  getCustomerStatistics,
  createWholesaler,
  deleteCloudinaryAsset,
  cloudinarySign,
  getAllWholesalers,
  // Cart management
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controller/customerController");
const {
  passwordVerificationLimit,
  emailVerificationLimit,
  phoneVerificationLimit,
} = require("../lib/email-sender/sender");

//verify email
router.post("/verify-email", emailVerificationLimit, verifyEmailAddress);

//verify phone number
router.post("/verify-phone", phoneVerificationLimit, verifyPhoneNumber);

//login with phone
router.post("/login-phone", loginWithPhone);

// shipping address send to array
router.post("/shipping/address/:id", addShippingAddress);

// get all shipping address
router.get("/shipping/address/:id", getShippingAddress);

// shipping address update
router.put("/shipping/address/:userId/:shippingId", updateShippingAddress);

// shipping address delete
router.delete("/shipping/address/:userId/:shippingId", deleteShippingAddress);

//register a user
router.post("/register/:token", registerCustomer);

//register a user directly
router.post("/signup", registerCustomerDirect);

// Wholesaler registration - accepts JSON (with Cloudinary URLs) or multipart files (handled in controller)
router.post("/wholesaler", createWholesaler);

// Delete uploaded Cloudinary asset
router.post("/cloudinary-delete", deleteCloudinaryAsset);

// Server-side cloudinary upload endpoint (accepts data URL)
router.post("/cloudinary-upload", async (req, res) => {
  // delegate to controller
  try {
    const controller = require('../controller/customerController');
    return controller.cloudinaryUpload(req, res);
  } catch (err) {
    console.error('cloudinary-upload route error:', err);
    res.status(500).send({ message: err.message });
  }
});

// Provide a signature for signed client uploads (allows return_delete_token)
router.post("/cloudinary-sign", cloudinarySign);

// Cloudinary status
router.get("/cloudinary-status", (req, res) => {
  try {
    const controller = require('../controller/customerController');
    return controller.cloudinaryStatus(req, res);
  } catch (err) {
    console.error('cloudinary-status route error:', err);
    res.status(500).send({ message: err.message });
  }
});

// Send credentials to wholesaler
router.post('/send-credentials/:id', async (req, res) => {
  try {
    const controller = require('../controller/customerController');
    return controller.sendCredentials(req, res);
  } catch (err) {
    console.error('send-credentials route error:', err);
    res.status(500).send({ message: err.message });
  }
});

// Admin: get wholesalers
router.get("/wholesalers", getAllWholesalers);

//login a user
router.post("/login", loginCustomer);

//register or login with google and fb
router.post("/signup/oauth", signUpWithOauthProvider);

//register or login with google and fb
router.post("/signup/:token", signUpWithProvider);

//forget-password
router.put("/forget-password", passwordVerificationLimit, forgetPassword);

//reset-password
router.put("/reset-password", resetPassword);

//change password
router.post("/change-password", changePassword);

//add all users
router.post("/add/all", addAllCustomers);

//get all user
router.get("/", getAllCustomers);

//get customer statistics
router.get("/statistics", getCustomerStatistics);

// ─── CART ROUTES ──────────────────────────────────────────────────────────────

// Get customer cart (populated) — must be BEFORE /:id wildcard
router.get("/cart/:customerId", getCart);

// Add item to cart
router.post("/cart/:customerId/add", addToCart);

// Update item quantity in cart
router.put("/cart/:customerId/update", updateCartItem);

// Remove a specific item from cart
router.delete("/cart/:customerId/remove/:productId", removeFromCart);

// Clear entire cart
router.delete("/cart/:customerId/clear", clearCart);

// ─────────────────────────────────────────────────────────────────────────────

//get a user
router.get("/:id", getCustomerById);

//update a user
router.put("/:id", updateCustomer);

//delete a user
router.delete("/:id", deleteCustomer);

module.exports = router;
