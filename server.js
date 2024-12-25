const express = require("express");
const dotenv = require("dotenv").config();
const connectDb = require("./config/dbConnection");
const customerRoute = require("./routes/customerRoutes");
const userRoutes = require("./routes/userRoutes");
const errorHandler = require("./middleware/errorHandler");

connectDb();

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());
// Middleware to parse x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);
app.use("/api/customers", customerRoute);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
