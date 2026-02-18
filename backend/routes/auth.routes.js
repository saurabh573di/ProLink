import express from "express"
import { login, logOut, signUp, sendOtp, verifyOtp, resetPassword, googleAuth } from "../controllers/auth.controllers.js"
import validate from "../middlewares/validate.js"
import { signupSchema, loginSchema, sendOtpSchema, verifyOtpSchema, resetPasswordSchema, googleAuthSchema } from "../validators/auth.validator.js"

const authRouter = express.Router()

// POST /api/v1/auth/signup - Register new user
authRouter.post("/signup", validate(signupSchema), signUp)

// POST /api/v1/auth/login - Login user
authRouter.post("/login", validate(loginSchema), login)

// GET /api/v1/auth/logout - Logout user
authRouter.get("/logout", logOut)

// POST /api/v1/auth/forgot-password - Send OTP
authRouter.post("/forgot-password", validate(sendOtpSchema), sendOtp)

// POST /api/v1/auth/verify-otp - Verify OTP
authRouter.post("/verify-otp", validate(verifyOtpSchema), verifyOtp)

// POST /api/v1/auth/reset-password - Reset password
authRouter.post("/reset-password", validate(resetPasswordSchema), resetPassword)

// POST /api/v1/auth/google - Google authentication
authRouter.post("/google", validate(googleAuthSchema), googleAuth)

export default authRouter