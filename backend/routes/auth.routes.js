/*
  routes/auth.routes.js - Authentication Routes
  =================================================================================
  ENDPOINTS:
  - POST /api/auth/signup : Register new user (requires: firstName, lastName, userName, email, password)
  - POST /api/auth/login : Login user (requires: email, password)
  - GET /api/auth/logout : Logout user (requires: auth cookie)
  
  NOTES:
  - Signup creates user, hashes password, generates JWT, sets cookie, returns user object
  - Login verifies credentials, generates JWT, sets cookie, returns user object
  - Logout clears JWT cookie
  - JWT tokens are HTTP-only cookies; valid for 7 days
=================================================================================
*/
import express from "express"
import { login, logOut, signUp } from "../controllers/auth.controllers.js"

let authRouter=express.Router()

authRouter.post("/signup",signUp)
authRouter.post("/login",login)
authRouter.get("/logout",logOut)

export default authRouter