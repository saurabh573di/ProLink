/*
  middlewares/validate.js - Request Validation Middleware
  =================================================================================
  PURPOSE:
  - Validate request data against Joi schemas
  - Centralized validation logic
  - Return clear error messages to client
  
  USAGE:
  - Apply to routes: router.post('/create', validate(postValidation.createPost), controller)
  - Validates body by default, but can validate query params, params, etc.
  
  BENEFITS:
  - Single line of code per validation
  - Consistent error responses
  - Prevents controller execution if validation fails
=================================================================================
*/

const validate = (schema, source = 'body') => {
  return async (req, res, next) => {
    try {
      // Determine what to validate based on source
      const dataToValidate = source === 'body' 
        ? req.body 
        : source === 'query' 
        ? req.query 
        : source === 'params' 
        ? req.params 
        : req.body;

      // Validate using Joi
      const { value, error } = await schema.validate(dataToValidate, {
        abortEarly: false, // Get all errors, not just first one
        stripUnknown: false, // Keep unknown fields
      });

      if (error) {
        // Format Joi errors into readable messages
        const errors = error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message,
        }));

        return res.status(400).json({
          message: "Validation Error",
          errors,
        });
      }

      // Store validated value in request for use in controller
      req.validatedData = value;
      next();
    } catch (err) {
      console.log("Validation middleware error:", err);
      return res.status(500).json({ message: "Validation error" });
    }
  };
};

export default validate;
