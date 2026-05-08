const mongoose = require("mongoose");

const pushNotificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    target: {
      type: String,
      required: true,
      enum: ["Customer", "Store", "Driver", "All"],
    },
    zone: {
      type: String,
      required: false,
      default: "All",
    },
    status: {
      type: String,
      required: false,
      default: "show",
      enum: ["show", "hide"],
    },
    sentCount: {
      type: Number,
      required: false,
      default: 0,
    },
    clickAction: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const PushNotification = mongoose.model("PushNotification", pushNotificationSchema);

module.exports = PushNotification;
