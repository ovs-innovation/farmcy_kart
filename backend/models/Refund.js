const mongoose = require("mongoose");

const refundSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      lowercase: true,
      enum: ["show", "hide"],
      default: "show",
    },
    title: {
      type: Object,
      required: true,
    },
    description: {
      type: Object,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Refund = mongoose.model("Refund", refundSchema);

module.exports = Refund;
