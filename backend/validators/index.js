/*
  validators/index.js - Validators Barrel Export
  =================================================================================
  PURPOSE:
  - Central export point for all validators
  - Simplifies imports across the application
  
  USAGE:
  Instead of:
  - import { signupSchema } from '../validators/auth.validator.js'
  - import { updateProfileSchema } from '../validators/user.validator.js'
  
  Use:
  - import { 
      signupSchema, 
      loginSchema, 
      updateProfileSchema, 
      searchSchema,
      // ... etc
    } from '../validators/index.js'
  
  Or even simpler:
  - import * as validators from '../validators/index.js'
  - use: validators.signupSchema
=================================================================================
*/

// Auth validators
export { signupSchema, loginSchema } from "./auth.validator.js";

// User validators
export { updateProfileSchema, searchSchema, getProfileSchema } from "./user.validator.js";

// Post validators
export { createPostSchema, commentSchema, getPostSchema, likePostSchema } from "./post.validator.js";

// Connection validators
export {
  sendConnectionSchema,
  updateConnectionSchema,
  getStatusSchema,
  removeConnectionSchema,
} from "./connection.validator.js";

// Notification validators
export { deleteNotificationSchema } from "./notification.validator.js";
