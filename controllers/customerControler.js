const asyncHandler = require("express-async-handler");

const customerDetails = require("../models/customerModel");

//desc get all customers
//routes GET api/customers
//@access public--private
const getCustomers = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }
  const allCustomers = await customerDetails.find();
  console.log("Fetched contacts:", allCustomers);
  res.status(200).json({ message: allCustomers });
});

//desc create new customers
//routes POST api/customers
//@access public-->Private
const addCustomer = asyncHandler(async (req, res) => {
  console.log("the body params we are sending:", req.body);

  console.log("req", req.user);

  if (!req.user || !req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    whatsApp_no,
    house_no,
    street,
    area,
    landmark,
    addressLine1,
    addressLine2,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !phoneNumber ||
    !whatsApp_no ||
    !house_no ||
    !street ||
    !area ||
    !landmark ||
    !addressLine1
  ) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  const addCustomer = await customerDetails.create({
    firstName,
    lastName,
    email,
    phoneNumber,
    whatsApp_no,
    address: {
      house_no,
      street,
      area,
      landmark,
      addressLine1,
      addressLine2,
    },
    user_id: req.user.id,
  });

  res.status(200).json(addCustomer);
});

module.exports = { getCustomers, addCustomer };
