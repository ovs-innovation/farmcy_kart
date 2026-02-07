const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },

    shippingAddress: [{
      name: {
        type: String,
        required: false,
      },
      address: {
        type: String,
        required: false,
      },
      city: {
        type: String,
        required: false,
      },
      country: {
        type: String,
        required: false,
      },
      zipCode: {
        type: String,
        required: false,
      },
      phone: {
        type: String,
        required: false,
      },
      isDefault: {
        type: Boolean,
        default: false,
      },
      addressType: {
        type: String,
        enum: ['Home', 'Work', 'Other'],
        default: 'Home',
      },
    }],
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: ["customer", "wholesaler"],
      default: "customer",
    },
    // Wholesaler specific fields
    aadhar: {
      type: String,
      required: false,
    },
    pan: {
      type: String,
      required: false,
    },
    gst: {
      type: String,
      required: false,
    },
    gstPublicId: {
      type: String,
      required: false,
    },
    drugLicense: {
      type: String,
      required: false,
    },
    drugLicensePublicId: {
      type: String,
      required: false,
    },
    aadharPublicId: {
      type: String,
      required: false,
    },
    aadharDeleteToken: {
      type: String,
      required: false,
    },
    panPublicId: {
      type: String,
      required: false,
    },
    panDeleteToken: {
      type: String,
      required: false,
    },
    gstNotRequired: {
      type: Boolean,
      default: false,
    },
    gstDeleteToken: {
      type: String,
      required: false,
    },
    drugLicenseNotRequired: {
      type: Boolean,
      default: false,
    },
    drugLicenseDeleteToken: {
      type: String,
      required: false,
    },
    lastLogin: {
      type: Date,
      required: false,
    },
    blocked: {
      type: Boolean,
      required: false,
      default: false,
    },
    // Credential email tracking
    credentialEmailCount: {
      type: Number,
      required: false,
      default: 0,
    },
    lastCredentialEmailSentAt: {
      type: Date,
      required: false,
    },
    cart: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
