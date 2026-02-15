/*
  validators/auth.validator.js - Authentication Validation Schemas
  =================================================================================
  PURPOSE:
  - Joi validation schemas for authentication endpoints
  - Handles signup and login request validation
  - Centralized auth validation rules
  
  EXPORTS:
  - signupSchema: Validates user registration data
  - loginSchema: Validates user login credentials
  
  USAGE:
  - import { signupSchema, loginSchema } from '../validators/auth.validator.js'
  - router.post('/signup', validate(signupSchema), controller)
=================================================================================
*/

import Joi from "joi";

// Signup validation schema
export const signupSchema = Joi.object({
  firstName: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.empty": "First name is required",
      "string.min": "First name must be at least 2 characters",
      "string.max": "First name must not exceed 50 characters",
    }),
  lastName: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      "string.empty": "Last name is required",
      "string.min": "Last name must be at least 2 characters",
      "string.max": "Last name must not exceed 50 characters",
    }),
  userName: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .regex(/^[a-zA-Z0-9._-]+$/)
    .messages({
      "string.empty": "Username is required",
      "string.min": "Username must be at least 3 characters",
      "string.max": "Username must not exceed 30 characters",
      "string.pattern.base": "Username can only contain letters, numbers, dots, dashes, and underscores",
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Email must be a valid email address",
    }),
  password: Joi.string()
    .min(8)
    .max(100)
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters",
      "string.max": "Password must not exceed 100 characters",
    }),
});

// Login validation schema
export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Email must be a valid email address",
    }),
  password: Joi.string()
    .required()
    .messages({
      "string.empty": "Password is required",
    }),
});
