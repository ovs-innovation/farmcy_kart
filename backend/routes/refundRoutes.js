const router = require("express").Router();
const {
  addRefundReason,
  getRefundData,
  updateRefundReason,
  updateReasonStatus,
  updateRefundMode,
  deleteRefundReason,
} = require("../controller/refundController");

// Add Refund Reason
router.post("/add", addRefundReason);

// Get All Refund Data (Reasons + Mode)
router.get("/all", getRefundData);

// Update Refund Reason
router.put("/:id", updateRefundReason);

// Update Reason Status
router.put("/status/:id", updateReasonStatus);

// Update Refund Mode (Global Toggle)
router.put("/mode/update", updateRefundMode);

// Delete Refund Reason
router.delete("/:id", deleteRefundReason);

module.exports = router;
