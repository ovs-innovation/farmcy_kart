const express = require("express");
const router = express.Router();
const {
  registerAdmin,
  loginAdmin,
  forgetPassword,
  resetPassword,
  addStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
  updatedStatus,
  updateFcmToken,
} = require("../controller/adminController");
const { passwordVerificationLimit } = require("../lib/email-sender/sender");

//register a staff
router.post("/register", registerAdmin);

//login a admin
router.post("/login", loginAdmin);

//forget-password
router.put("/forget-password", passwordVerificationLimit, forgetPassword);

//reset-password
router.put("/reset-password", resetPassword);

//add a staff
router.post("/add", addStaff);

//get all staff
router.get("/", getAllStaff);

//get a staff
router.post("/:id", getStaffById);

//update a staff
router.put("/:id", updateStaff);

//update staf status
router.put("/update-status/:id", updatedStatus);

//delete a staff
router.delete("/:id", deleteStaff);

// update fcm token
router.put("/update-fcm-token/:id", updateFcmToken);

module.exports = router;
