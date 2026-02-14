/*
  routes/notification.routes.js - Notification Routes
  =================================================================================
  ENDPOINTS:
  - GET /api/notification/get [AUTH] : Get all notifications for logged-in user
  - DELETE /api/notification/deleteone/:id [AUTH] : Delete single notification by ID
  - DELETE /api/notification/ [AUTH] : Clear all notifications for user
  
  NOTES:
  - Notifications are created automatically by post.controllers (like/comment) and 
    connection.controllers (accept), not via these routes
  - These routes are read/delete only; no POST/PUT for manual creation
  - Populated with relatedUser and relatedPost info for display
=================================================================================
*/
import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { clearAllNotification, deleteNotification, getNotifications } from "../controllers/notification.controllers.js"

let notificationRouter=express.Router()

notificationRouter.get("/get",isAuth,getNotifications)
notificationRouter.delete("/deleteone/:id",isAuth,deleteNotification)
notificationRouter.delete("/",isAuth,clearAllNotification)
export default notificationRouter