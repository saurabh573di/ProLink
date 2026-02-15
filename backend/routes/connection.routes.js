/*
  routes/connection.routes.js - Connection/Networking Routes
  =================================================================================
  ENDPOINTS:
  - POST /api/v1/connection/send/:userId [AUTH] : Send connection request
  - PUT /api/v1/connection/accept/:connectionId [AUTH] : Accept pending request
  - PUT /api/v1/connection/reject/:connectionId [AUTH] : Reject pending request
  - GET /api/v1/connection/getstatus/:userId [AUTH] : Get connection status with user
  - DELETE /api/v1/connection/remove/:userId [AUTH] : Remove/disconnect from user
  - GET /api/v1/connection/requests [AUTH] : Get all pending connection requests
  - GET /api/v1/connection/ [AUTH] : Get all accepted connections for user
  
  NOTES:
  - Status values: "Connect", "pending", "received", "disconnect"
  - All endpoints emit socket "statusUpdate" for real-time UI sync
  - Connections are bidirectional: both users added to each other's connection array
  - Requests page shows pending requests, users can accept/reject them
  - All endpoints include Joi validation for IDs
=================================================================================
*/
import express from "express"
import { acceptConnection, getConnectionRequests, getConnectionStatus, getUserConnections, rejectConnection, removeConnection, sendConnection } from "../controllers/connection.controllers.js"
import isAuth from "../middlewares/isAuth.js"
import validate from "../middlewares/validate.js"
import { sendConnectionSchema, updateConnectionSchema, getStatusSchema } from "../validators/connection.validator.js"

let connectionRouter = express.Router()

// POST /api/v1/connection/send/:userId - Send connection request
// Validates: userId parameter (valid MongoDB ObjectId)
connectionRouter.post("/send/:id", isAuth, validate(sendConnectionSchema, 'params'), sendConnection)

// PUT /api/v1/connection/accept/:connectionId - Accept pending request
// Validates: connectionId parameter
connectionRouter.put("/accept/:connectionId", isAuth, validate(updateConnectionSchema, 'params'), acceptConnection)

// PUT /api/v1/connection/reject/:connectionId - Reject pending request
// Validates: connectionId parameter
connectionRouter.put("/reject/:connectionId", isAuth, validate(updateConnectionSchema, 'params'), rejectConnection)

// GET /api/v1/connection/getstatus/:userId - Get connection status
// Validates: userId parameter
connectionRouter.get("/getstatus/:userId", isAuth, validate(getStatusSchema, 'params'), getConnectionStatus)

// DELETE /api/v1/connection/remove/:userId - Remove/disconnect from user
connectionRouter.delete("/remove/:userId", isAuth, removeConnection)

// GET /api/v1/connection/requests - Get all pending connection requests
connectionRouter.get("/requests", isAuth, getConnectionRequests)

// GET /api/v1/connection/ - Get all accepted connections for user
connectionRouter.get("/", isAuth, getUserConnections)

export default connectionRouter