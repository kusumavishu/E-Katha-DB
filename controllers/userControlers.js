const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");

const user = require("../models/userModel");

const registerUser = asyncHandler(async (req, res) => {
  const { shopName, firstName, lastName, phoneNumber, email, password } =
    req.body;
  // console.log("userInformation", userName, email, password);

  if (
    !shopName ||
    !firstName ||
    !lastName ||
    !phoneNumber ||
    !email ||
    !password
  ) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }

  const userAvailable = await user.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("user already registered!");
  }

  const hashPassword = await bcrypt.hash(password, 15);

  const newUser = await user.create({
    shopName,
    firstName,
    lastName,
    phoneNumber,
    email,
    password: hashPassword,
  });

  console.log(`user created Succesfully ${newUser}`);

  if (newUser) {
    res.status(201).json(newUser);
  } else {
    res.status(400);
    throw new Error("user data is not vaild");
  }

  res.status(200).json({ message: "register the user" });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log("loginUser", email, password);

  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }

  const userInfo = await user.findOne({ email });

  console.log("userInfor", userInfo);

  if (userInfo) {
    if (await bcrypt.compare(password, userInfo.password)) {
      const accessToken = jwt.sign(
        {
          user: {
            id: userInfo._id,
            email: userInfo.email,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
          audience: "Ekatha.com",
          issuer: "Ekatha Finance App",
          subject: `user_subject_Authentication`,
          jwtid: `unique-token-2020${userInfo._id}`,
        }
      );
      console.log("accessToken");
      res.status(200).json({ token: accessToken });
    } else {
      res.status(401);
      throw new Error("Invaild password!");
    }
  } else {
    res.status(401);
    throw new Error("not Found");
  }
});

const currentUser = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

const allUser = asyncHandler(async (req, res) => {
  try {
    const allUser = await user.find();
    res.status(200).json(allUser);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error });
  }
  res.status(200).json({ message: user });
});

module.exports = { registerUser, loginUser, currentUser, allUser };
