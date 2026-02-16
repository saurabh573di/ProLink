/*
  validators/user.validator.js - User Profile Validation Schemas
  =================================================================================
  PURPOSE:
  - Joi validation schemas for user profile endpoints
  - Handles profile updates, search queries, and profile retrieval
  
  EXPORTS:
  - updateProfileSchema: Validates profile update data
  - searchSchema: Validates user search query
  
  USAGE:
  - import { updateProfileSchema, searchSchema } from '../validators/user.validator.js'
  - router.put('/updateprofile', validate(updateProfileSchema), controller)
  - router.get('/search', validate(searchSchema, 'query'), controller)
=================================================================================
*/

import Joi from "joi";

// Update profile validation schema
export const updateProfileSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .optional()
    .messages({
      "string.min": "First name must be at least 2 characters",
      "string.max": "First name must not exceed 50 characters",
    }),
  lastName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .optional()
    .messages({
      "string.min": "Last name must be at least 2 characters",
      "string.max": "Last name must not exceed 50 characters",
    }),
  headline: Joi.string()
    .trim()
    .max(160)
    .optional()
    .messages({
      "string.max": "Headline must not exceed 160 characters",
    }),
  location: Joi.string()
    .trim()
    .max(100)
    .optional()
    .messages({
      "string.max": "Location must not exceed 100 characters",
    }),
  gender: Joi.string()
    .trim()
    .valid("male", "female", "other")
    .optional()
    .messages({
      "any.only": 'Gender must be either "male", "female", or "other"',
    }),
  skills: Joi.alternatives()
    .try(
      Joi.string(),
      Joi.array().items(Joi.string().max(50))
    )
    .optional()
    .messages({
      "string.max": "Each skill must not exceed 50 characters",
    }),
  education: Joi.alternatives()
    .try(
      Joi.string(),
      Joi.array().items(
        Joi.object({
          college: Joi.string().max(100),
          degree: Joi.string().max(50),
          fieldOfStudy: Joi.string().max(100),
        })
      )
    )
    .optional(),
  experience: Joi.alternatives()
    .try(
      Joi.string(),
      Joi.array().items(
        Joi.object({
          title: Joi.string().max(100),
          company: Joi.string().max(100),
          description: Joi.string().max(500),
        })
      )
    )
    .optional(),
}).unknown(true); // Allow file fields (profileImage, coverImage) which are handled by multer

// Search validation schema
export const searchSchema = Joi.object({
  query: Joi.string()
    .min(1)
    .max(100)
    .required()
    .messages({
      "string.empty": "Search query is required",
      "string.min": "Search query must be at least 1 character",
      "string.max": "Search query must not exceed 100 characters",
    }),
});

// Get profile validation schema (userName parameter)
export const getProfileSchema = Joi.object({
  userName: Joi.string()
    .trim()
    .min(1)
    .max(30)
    .required()
    .messages({
      "string.empty": "Username is required",
      "string.min": "Username must be at least 1 character",
      "string.max": "Username must not exceed 30 characters",
    }),
});
