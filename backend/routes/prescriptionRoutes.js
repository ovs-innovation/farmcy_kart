const express = require("express");
const router = express.Router();
const {
  uploadPrescription,
  getAllPrescriptions,
  getUserPrescriptions,
  getPrescriptionById,
  updatePrescriptionStatus,
  deletePrescription,
  markAsAddedToCart,
} = require("../controller/prescriptionController");

// Upload prescription (public endpoint)
router.post("/upload", uploadPrescription);

// Get all prescriptions (for admin)
router.get("/", getAllPrescriptions);

// Get prescriptions by user
router.get("/user/:userId", getUserPrescriptions);

// Get prescription by ID
router.get("/:id", getPrescriptionById);

// Update prescription status
router.put("/:id/status", updatePrescriptionStatus);

// Mark as added to cart
router.put("/:id/added-to-cart", markAsAddedToCart);

// Delete prescription
router.delete("/:id", deletePrescription);

module.exports = router;

