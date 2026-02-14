/*
  routes/connection.routes.js - Connection/Networking Routes
  =================================================================================
  ENDPOINTS:
  - POST /api/connection/send/:userId [AUTH] : Send connection request
  - PUT /api/connection/accept/:connectionId [AUTH] : Accept pending request
  - PUT /api/connection/reject/:connectionId [AUTH] : Reject pending request
  - GET /api/connection/getstatus/:userId [AUTH] : Get connection status with user
  - DELETE /api/connection/remove/:userId [AUTH] : Remove/disconnect from user
  - GET /api/connection/requests [AUTH] : Get all pending connection requests
  - GET /api/connection/ [AUTH] : Get all accepted connections for user
  
  NOTES:
  - Status values: "Connect", "pending", "received", "disconnect"
  - All endpoints emit socket "statusUpdate" for real-time UI sync
  - Connections are bidirectional: both users added to each other's connection array
  - Requests page shows pending requests, users can accept/reject them
=================================================================================
*/
import express from "express"
import { acceptConnection, getConnectionRequests, getConnectionStatus, getUserConnections, rejectConnection, removeConnection, sendConnection } from "../controllers/connection.controllers.js"
import isAuth from "../middlewares/isAuth.js"
let connectionRouter=express.Router()

connectionRouter.post("/send/:id",isAuth,sendConnection)
connectionRouter.put("/accept/:connectionId",isAuth,acceptConnection)
connectionRouter.put("/reject/:connectionId",isAuth,rejectConnection)
connectionRouter.get("/getstatus/:userId",isAuth,getConnectionStatus)
connectionRouter.delete("/remove/:userId",isAuth,removeConnection)
connectionRouter.get("/requests",isAuth,getConnectionRequests)
connectionRouter.get("/",isAuth,getUserConnections)


export default connectionRouter