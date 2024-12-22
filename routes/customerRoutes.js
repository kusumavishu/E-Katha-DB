const express = require("express");
const router = express.Router();

const {
  getCustomers,
  addCustomer,
} = require("../controllers/customerControler");

const validateToken = require("../middleware/validateToken");

router.use(validateToken);

router.route("/").get(getCustomers).post(addCustomer);

module.exports = router;
