const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const { isAuthOptional } = require("../config/auth");
const {
  addProductView,
  getRecommendations,
  addProduct,
  addAllProducts,
  getAllProducts,
  getShowingProducts,
  getProductById,
  getProductBySlug,
  updateProduct,
  updateManyProducts,
  updateStatus,
  deleteProduct,
  deleteManyProducts,
  getShowingStoreProducts,
} = require("../controller/productController");

// Rate limiters to prevent abuse
const viewLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // Limit each IP to 100 views per hour
  message: "Too many views from this IP, please try again after an hour"
});

const recommendationLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // Limit each IP to 20 recommendation requests per minute
  standardHeaders: true,
  legacyHeaders: false,
});

//add a product
router.post("/add", addProduct);

//track product view
router.post("/view", viewLimiter, isAuthOptional, addProductView);

//get recommendations (using POST to allow body with guest IDs if needed)
router.post("/recommendations", recommendationLimiter, isAuthOptional, getRecommendations);

//get suggested products (GET endpoint as requested)
router.get("/suggested", recommendationLimiter, isAuthOptional, getRecommendations);

//add multiple products
router.post("/all", addAllProducts);

//get a product
router.post("/:id", getProductById);

//get showing products only
router.get("/show", getShowingProducts);

//get showing products in store
router.get("/store", getShowingStoreProducts);

//get all products
router.get("/", getAllProducts);

//get a product by slug
router.get("/product/:slug", getProductBySlug);

//update a product
router.patch("/:id", updateProduct);

//update many products
router.patch("/update/many", updateManyProducts);

//update a product status
router.put("/status/:id", updateStatus);

//delete a product
router.delete("/:id", deleteProduct);

//delete many product
router.patch("/delete/many", deleteManyProducts);

module.exports = router;
