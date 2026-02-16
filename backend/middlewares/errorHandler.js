/*
  middlewares/errorHandler.js - Global Error Handler Middleware
  =================================================================================
  PURPOSE:
  - Centralized error handling for all API endpoints
  - Catches and formats errors to provide consistent responses
  - Handles specific error types: ValidationError, CastError, MongoError, MulterError, JWT errors
  
  IMPORTANT:
  - Must be added AFTER all routes in index.js
  - Must be added BEFORE app.listen()
  - Requires 4 parameters (err, req, res, next) to work as error handler
  
  USAGE:
  - In controllers: use try-catch with next(error) in catch block
  - Example: catch(error) { next(error) }
  - The errorHandler will catch and format the error response
  
  ERROR TYPES HANDLED:
  - ValidationError: 400 Bad Request
  - CastError (Invalid MongoDB ID): 400 Bad Request
  - MongoError 11000 (Duplicate key): 409 Conflict
  - MulterError: 400 Bad Request (file upload errors)
  - JsonWebTokenError: 401 Unauthorized
  
  IMPORTANT NOTES:
  - Always use next(error) in catch blocks, never res.status directly
  - Error middleware location is critical: AFTER routes, BEFORE listen
  - The middleware will handle all unhandled errors gracefully
=================================================================================
*/

export const errorHandler = (err, req, res, next) => {
  // Short circuiting: set default values
  err.message = err.message || "Something went wrong";
  err.statusCode = err.statusCode || 500;

  // Joi Validation Error
  if (err.name === "ValidationError") {
    err.statusCode = 400;
    err.message = err.message;
  }
  // MongoDB Duplicate Key Error (11000)
  else if (err.code === 11000) {
    let key = Object.keys(err.keyValue);
    key = key[0].charAt(0).toUpperCase() + key[0].slice(1);
    err.statusCode = 409;
    err.message = `${key} already exists`;
  }
  // MongoDB Invalid ID (CastError)
  else if (err.name === "CastError") {
    err.statusCode = 400;
    err.message = `Invalid ${err.path}: ${err.value}`;
  }
  // Multer File Upload Errors
  else if (err.name === "MulterError") {
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      err.statusCode = 400;
      err.message = "You can only upload one image";
    } else if (err.code === "LIMIT_FILE_SIZE") {
      err.statusCode = 400;
      err.message = "File size should be less than 1MB";
    }
  }
  // JWT Token Errors
  else if (err.name === "JsonWebTokenError") {
    err.statusCode = 401;
    err.message = "Invalid token, Please login again!";
  }

  // Send error response
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    errObject: process.env.NODE_ENV === "production" ? {} : err,
    errLine: process.env.NODE_ENV === "production" ? "" : err.stack,
  });
};
