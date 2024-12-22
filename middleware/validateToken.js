const asyncHandler = require("express-async-handler");

const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
  console.log("Middleware triggered");
  let token;

  const authHeader = req.headers.Authorization || req.headers.authorization;
  console.log("bearer", authHeader);

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
    console.log("Extracted token:", token);

    // Token verifications
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      {
        audience: "Ekatha.com",
        issuer: "Ekatha Finance App",
        subject: `user_subject_Authentication`,
        // jwtid: "unique-token-2020@password#1226",
      },
      (err, decoded) => {
        if (err) {
          console.error("Token verification failed:", err.message);
          res.status(401);
          throw new Error("user is not authorized");
        }
        console.log(">>>", decoded);

        const expectedjwtid = `unique-token-2020${decoded.user.id}`;
        if (decoded.jti !== expectedjwtid) {
          console.error("Invalid JWT id");
          res.status(401);
          throw new Error("Invalid JWT id");
        }

        req.user = decoded.user; // Attach the user info to the reques
        next();
      }
    );
  } else {
    res.status(401);
    throw new Error("User is not authorized or token is missing");
  }
});

module.exports = validateToken;
