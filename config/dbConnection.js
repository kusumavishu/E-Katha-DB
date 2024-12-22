const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const connectedResponse = await mongoose.connect(
      process.env.CONNECTION_STRING
    );

    console.log(
      "Database established:",
      connectedResponse.connection.host,
      connectedResponse.connection.name
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDb;
