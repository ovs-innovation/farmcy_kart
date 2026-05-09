const Refund = require("../models/Refund");
const Setting = require("../models/Setting");

// Add Refund Reason
const addRefundReason = async (req, res) => {
  try {
    const newRefund = new Refund({
      title: req.body.title,
      status: req.body.status || "show",
    });
    await newRefund.save();
    res.status(200).send({
      message: "Refund Reason Added Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// Get All Refund Data (Reasons + Mode)
const getRefundData = async (req, res) => {
  try {
    const reasons = await Refund.find({}).sort({ createdAt: -1 });
    const setting = await Setting.findOne({ name: "refundSetting" });
    res.send({
      reasons,
      refundMode: setting ? setting.setting.refundMode : true,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// Update Refund Reason
const updateRefundReason = async (req, res) => {
  try {
    const refund = await Refund.findById(req.params.id);
    if (refund) {
      refund.title = req.body.title;
      refund.status = req.body.status;
      await refund.save();
      res.send({
        message: "Refund Reason Updated Successfully!",
      });
    } else {
        res.status(404).send({ message: "Refund reason not found" });
    }
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// Update Status of Reason
const updateReasonStatus = async (req, res) => {
  try {
    const newStatus = req.body.status;
    await Refund.updateOne(
      { _id: req.params.id },
      {
        $set: {
          status: newStatus,
        },
      }
    );
    res.send({
      message: `Refund Reason ${newStatus} Successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// Update Refund Mode (Global Toggle)
const updateRefundMode = async (req, res) => {
  try {
    const { refundMode } = req.body;
    await Setting.findOneAndUpdate(
      { name: "refundSetting" },
      {
        $set: {
          "setting.refundMode": refundMode,
        },
      },
      { upsert: true, new: true }
    );
    res.send({
      message: `Refund Request Mode ${refundMode ? 'Enabled' : 'Disabled'} Successfully!`,
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

// Delete Refund Reason
const deleteRefundReason = async (req, res) => {
  try {
    await Refund.deleteOne({ _id: req.params.id });
    res.send({
      message: "Refund Reason Deleted Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

module.exports = {
  addRefundReason,
  getRefundData,
  updateRefundReason,
  updateReasonStatus,
  updateRefundMode,
  deleteRefundReason,
};
