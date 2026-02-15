/*
  validators/post.validator.js - Post Validation Schemas
  =================================================================================
  PURPOSE:
  - Joi validation schemas for post endpoints
  - Handles post creation, comments, and feed pagination
  
  EXPORTS:
  - createPostSchema: Validates post creation data
  - commentSchema: Validates comment content
  - getPostSchema: Validates pagination parameters
  
  USAGE:
  - import { createPostSchema, commentSchema, getPostSchema } from '../validators/post.validator.js'
  - router.post('/create', validate(createPostSchema), controller)
  - router.post('/comment/:id', validate(commentSchema), controller)
  - router.get('/getpost', validate(getPostSchema, 'query'), controller)
=================================================================================
*/

import Joi from "joi";

// Create post validation schema
export const createPostSchema = Joi.object({
  description: Joi.string()
    .max(5000)
    .optional()
    .messages({
      "string.max": "Post description must not exceed 5000 characters",
    }),
})
  .external(async (value) => {
    // Custom validation: must have description OR image
    if (!value.description && !value.image) {
      throw new Error("Post must have either description or image");
    }
  })
  .unknown(true); // Allow image field which is handled by multer

// Comment validation schema
export const commentSchema = Joi.object({
  content: Joi.string()
    .min(1)
    .max(1000)
    .required()
    .trim()
    .messages({
      "string.empty": "Comment cannot be empty",
      "string.min": "Comment must be at least 1 character",
      "string.max": "Comment must not exceed 1000 characters",
    }),
});

// Get posts validation schema (pagination)
export const getPostSchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      "number.base": "Page must be a number",
      "number.min": "Page must be at least 1",
    }),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10)
    .messages({
      "number.base": "Limit must be a number",
      "number.min": "Limit must be at least 1",
      "number.max": "Limit must not exceed 100",
    }),
});
