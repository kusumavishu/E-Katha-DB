const { constants } = require("../constants"); //fileName Should be Correct
// console.log("constants object:", constants);

const errorHandler = (err, req, res, next) => {
  console.log("errorHandler statusCode", res.statusCode);
  // console.log("vishu", constants.VALIDATION_ERROR);
  const statusCode = res.statusCode ? res.statusCode : 500;
  switch (statusCode) {
    case constants.VALIDATION_ERROR:
      res.json({
        title: "validation error",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case constants.UNAUTHORIZED:
      res.json({
        title: "unauthorized",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case constants.FORBIDDEN:
      res.json({
        title: "forbidden",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case constants.NOT_FOUND:
      res.json({
        title: "not found",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    case constants.SERVER_ERROR:
      res.json({
        title: "server not found",
        message: err.message,
        stackTrace: err.stack,
      });
      break;
    default:
      console.log("all are okay! proced");
  }
};

module.exports = errorHandler;
