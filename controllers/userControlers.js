const asyncHandler = require("express-async-handler");

const jwt = require("jsonwebtoken");

const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const user = require("../models/userModel");

const fs = require("fs");
const path = require("path");

// Store OTPs temporarily
const otpStore = new Map();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  service: "gmail",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  debug: true, // Add debug mode
  logger: true, // Log SMTP interactions
});

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
    res.status(404);
    throw new Error("not Found");
  }
});

const sendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;
  console.log("email", email);

  if (!email) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }

  const userInfo = await user.findOne({ email });

  if (userInfo) {
    const otp = crypto.randomInt(100000, 999999);
    const expiryTime = Date.now() + 5 * 60 * 1000;

    otpStore.set(email, { otp, expiryTime });

    try {
      const templatePath = path.join(
        __dirname,
        "../Template/otp-email-template.html"
      );

      const htmlTemplate = fs.readFileSync(templatePath, "utf-8");

      const htmlMessage = htmlTemplate.replace("{{OTP}}", otp);

      const sendOTP = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your One-Time Password from Ekatha App – Don't Share!",
        text: `Your One-Time Password (OTP) code is ${otp}. It will expire in 5 minutes.`,
        html: htmlMessage,
      });

      if (sendOTP) {
        const expiryToken = jwt.sign(
          {
            user: {
              id: expiryTime + expiryTime,
              email: userInfo.email,
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "10m",
            audience: "Ekatha.com",
            issuer: "Ekatha Finance App",
            subject: `user_subject_Authentication`,
            jwtid: `unique-token-2020${expiryTime + expiryTime}`,
          }
        );
        res.status(200).json({
          message: "OTP sent successfully",
          ExpToken: expiryToken,
        });
        console.log("otp", otpStore);
      }
    } catch (error) {
      console.log("ERROR", error);
      res.status(500);
      throw new Error("Failed to send OTP");
    }
  } else {
    res.status(404);
    throw new Error("you are not register with us");
  }
});

const verifyOTP = asyncHandler(async (req, res) => {
  const { otp } = req.body;

  console.log("req.user:", req.user.email);

  if (!req.user || !req.user.id) {
    res.status(401);
    throw new Error("ExpToken not authorized");
  }

  if (!otp) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const { email } = req.user;

  const storedData = otpStore.get(email);
  console.log("storedData", storedData);

  if (!storedData) {
    console.log("OTP not found");
    res.status(404);
    throw new Error("OTP not found or expired");
  }

  if (storedData.expiryTime < Date.now()) {
    otpStore.delete(email);
    return res.status(400).json({ message: "OTP expired" });
  }

  if (parseInt(otp) === storedData.otp) {
    // generate code
    otpStore.delete(email);
    res.status(200).json({ message: "OTP verified successfully" });
  } else {
    res.status(400);
    throw new Error("Invalid OTP");
  }

  res.status(200).json({ message: "verifyotp" });
});

const updatePassword = asyncHandler(async (req, res) => {
  const { newPassword, confirmPassword } = req.body;
  const { email } = req.user;

  if (!req.user || !req.user.id) {
    res.status(401);
    throw new Error("ExpToken not authorized");
  }

  if (!newPassword || !confirmPassword) {
    res.status(400);
    throw new Error("All fields are mandory");
  }

  if (newPassword !== confirmPassword) {
    res.status(400);
    throw new Error("Passwords do not match. Please try again.");
  }

  const userInfo = await user.findOne({ email });

  console.log("userInfo", userInfo);

  if (userInfo) {
    const hashPassword = await bcrypt.hash(newPassword, 15);

    const [updatePassword] = await user.update(
      {
        password: hashPassword,
      },
      { where: { email } }
    );
    console.log("updatePassword", updatePassword);
    if (updatePassword > 0) {
      res.status(200).json({ message: "Password updated successfully." });
    } else {
      res.status(400);
      throw new Error("Failed to update password.");
    }
  } else {
    res.status(404);
    throw new Error("You do not have permission to modify the password.");
  }

  res.status(200).json(req.user);
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

module.exports = {
  registerUser,
  loginUser,
  updatePassword,
  verifyOTP,
  sendOTP,
  currentUser,
  allUser,
};
