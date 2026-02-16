/*
  routes/notification.routes.js - Notification Routes
  =================================================================================
  ENDPOINTS:
  - GET /api/v1/notification/get [AUTH] : Get all notifications for logged-in user
  - DELETE /api/v1/notification/deleteone/:id [AUTH] : Delete single notification by ID
  - DELETE /api/v1/notification/ [AUTH] : Clear all notifications for user
  
  NOTES:
  - Notifications are created automatically by post.controllers (like/comment) and 
    connection.controllers (accept), not via these routes
  - These routes are read/delete only; no POST/PUT for manual creation
  - Populated with relatedUser and relatedPost info for display
  - All endpoints include Joi validation
=================================================================================
*/
import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { clearAllNotification, deleteNotification, getNotifications } from "../controllers/notification.controllers.js"
import validate from "../middlewares/validate.js"
import { deleteNotificationSchema } from "../validators/notification.validator.js"

const notificationRouter = express.Router()

// GET /api/v1/notification/get - Get all notifications for user
notificationRouter.get("/get", isAuth, getNotifications)

// DELETE /api/v1/notification/deleteone/:id - Delete single notification
// Validates: notification ID (valid MongoDB ObjectId)
notificationRouter.delete("/deleteone/:id", isAuth, validate(deleteNotificationSchema, 'params'), deleteNotification)

// DELETE /api/v1/notification/ - Clear all notifications for user
notificationRouter.delete("/", isAuth, clearAllNotification)

export default notificationRouter