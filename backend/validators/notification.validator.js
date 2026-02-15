/*
  validators/notification.validator.js - Notification Validation Schemas
  =================================================================================
  PURPOSE:
  - Joi validation schemas for notification endpoints
  - Handles notification deletion operations
  
  EXPORTS:
  - deleteNotificationSchema: Validates notification deletion request
  
  USAGE:
  - import { deleteNotificationSchema } from '../validators/notification.validator.js'
  - router.delete('/deleteone/:id', validate(deleteNotificationSchema, 'params'), controller)
=================================================================================
*/

import Joi from "joi";

// Delete notification validation schema
export const deleteNotificationSchema = Joi.object({
  id: Joi.string()
    .length(24)
    .hex()
    .required()
    .messages({
      "string.empty": "Notification ID is required",
      "string.length": "Invalid notification ID format",
    }),
});
