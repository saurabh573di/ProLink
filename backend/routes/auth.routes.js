/*
  routes/auth.routes.js - Authentication Routes
  =================================================================================
  ENDPOINTS:
  - POST /api/v1/auth/signup : Register new user (requires: firstName, lastName, userName, email, password)
  - POST /api/v1/auth/login : Login user (requires: email, password)
  - GET /api/v1/auth/logout : Logout user (requires: auth cookie)
  
  NOTES:
  - Signup creates user, hashes password, generates JWT, sets cookie, returns user object
  - Login verifies credentials, generates JWT, sets cookie, returns user object
  - Logout clears JWT cookie
  - JWT tokens are HTTP-only cookies; valid for 7 days
  - All endpoints include Joi validation on request body
=================================================================================
*/
import express from "express"
import { login, logOut, signUp } from "../controllers/auth.controllers.js"
import validate from "../middlewares/validate.js"
import { signupSchema, loginSchema } from "../validators/auth.validator.js"

const authRouter = express.Router()

// POST /api/v1/auth/signup - Register new user
// Validates: firstName, lastName, userName, email, password
authRouter.post("/signup", validate(signupSchema), signUp)

// POST /api/v1/auth/login - Login user
// Validates: email, password
authRouter.post("/login", validate(loginSchema), login)

// GET /api/v1/auth/logout - Logout user
authRouter.get("/logout", logOut)

export default authRouter