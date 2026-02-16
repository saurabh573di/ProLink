/*
  validators/connection.validator.js - Connection Validation Schemas
  =================================================================================
  PURPOSE:
  - Joi validation schemas for connection/networking endpoints
  - Handles connection requests, acceptance, rejection, and status checks
  
  EXPORTS:
  - sendConnectionSchema: Validates connection request data
  - updateConnectionSchema: Validates connection update (accept/reject)
  - getStatusSchema: Validates connection status request
  
  USAGE:
  - import { sendConnectionSchema, updateConnectionSchema, getStatusSchema } from '../validators/connection.validator.js'
  - router.post('/send/:id', validate(sendConnectionSchema, 'params'), controller)
  - router.put('/accept/:id', validate(updateConnectionSchema, 'params'), controller)
  - router.get('/getstatus/:id', validate(getStatusSchema, 'params'), controller)
=================================================================================
*/

import Joi from "joi";

// Send connection validation schema
export const sendConnectionSchema = Joi.object({
  id: Joi.string()
    .trim()
    .length(24) // MongoDB ObjectId length
    .hex()
    .required()
    .messages({
      "string.empty": "User ID is required",
      "string.length": "Invalid user ID format",
    }),
});

// Update connection validation schema (accept/reject)
export const updateConnectionSchema = Joi.object({
  connectionId: Joi.string()
    .trim()
    .length(24)
    .hex()
    .required()
    .messages({
      "string.empty": "Connection ID is required",
      "string.length": "Invalid connection ID format",
    }),
});

// Get connection status validation schema
export const getStatusSchema = Joi.object({
  userId: Joi.string()
    .trim()
    .length(24)
    .hex()
    .required()
    .messages({
      "string.empty": "User ID is required",
      "string.length": "Invalid user ID format",
    }),
});

// Remove connection validation schema  
export const removeConnectionSchema = Joi.object({
  userId: Joi.string()
    .trim()
    .length(24)
    .hex()
    .required()
    .messages({
      "string.empty": "User ID is required",
      "string.length": "Invalid user ID format",
    }),
});
