const mongoose = require("mongoose");

const customerSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true],
      ref: "user",
    },
    firstName: {
      type: String,
      required: [true, "first name is required"],
    },
    lastName: {
      type: String,
      required: [true, "last name is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
    },
    phoneNumber: {
      type: String,
      required: [true, "phoneNumber is required"],
    },
    whatsApp_no: {
      type: String,
      required: [true, "whatsapp number is required"],
    },
    address: {
      house_no: { type: String, required: true },
      street: { type: String, required: true },
      area: { type: String, required: true },
      landmark: { type: String, required: true },
      addressLine1: { type: String, required: true },
      addressLine2: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("customerDetails", customerSchema);
