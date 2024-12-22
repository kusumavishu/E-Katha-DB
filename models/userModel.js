const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    shopName: { type: String, required: [true, "shop name is required"] },
    firstName: { type: String, required: [true, "firstName is required"] },
    lastName: { type: String, required: [true, "lastName is required"] },
    phoneNumber: { type: String, required: true },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "email is already exists"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.id; // Delete the `id` field from the output
      },
    },
    // id: false,
  }
);

userSchema
  .virtual("fullName")
  .get(function () {
    return `${this.lastName} ${this.firstName}`;
  })
  .set(function (value) {
    const [lastName, firstName] = value.split(" ");
    this.lastName = lastName;
    this.firstName = firstName;
  });

module.exports = mongoose.model("user", userSchema);
