/*
  routes/user.routes.js - User Profile Routes
  =================================================================================
  ENDPOINTS:
  - GET /api/v1/user/currentuser [AUTH] : Get logged-in user's full profile
  - GET /api/v1/user/profile/:userName [AUTH] : Get any user's profile by userName
  - GET /api/v1/user/search?query= [AUTH] : Search users by name/skills (text + regex fallback)
  - GET /api/v1/user/suggestedusers [AUTH] : Get users not in your network
  - PUT /api/v1/user/updateprofile [AUTH + MULTIPART] : Update profile (fields + images)
  
  NOTES:
  - updateProfile uses multer.fields() for profileImage and coverImage files
  - All user endpoints require isAuth middleware
  - Profile endpoints return password-excluded user objects
  - All endpoints include Joi validation
=================================================================================
*/
import express from "express"
import { getCurrentUser, getprofile, getSuggestedUser, search, updateProfile } from "../controllers/user.controllers.js"
import isAuth from "../middlewares/isAuth.js"
import upload from "../middlewares/multer.js"
import validate from "../middlewares/validate.js"
import { updateProfileSchema, searchSchema } from "../validators/user.validator.js"

let userRouter = express.Router()

// GET /api/v1/user/currentuser - Get logged-in user's profile
userRouter.get("/currentuser", isAuth, getCurrentUser)

// PUT /api/v1/user/updateprofile - Update profile with image uploads
// Validates: firstName, lastName, headline, location, skills, education, experience
userRouter.put("/updateprofile", isAuth, upload.fields([
   {name: "profileImage", maxCount: 1},
   {name: "coverImage", maxCount: 1}
]), validate(updateProfileSchema), updateProfile)

// GET /api/v1/user/profile/:userName - Get specific user's profile
userRouter.get("/profile/:userName", isAuth, getprofile)

// GET /api/v1/user/search?query= - Search users by name/skills
// Validates: query parameter (min 1, max 100 characters)
userRouter.get("/search", isAuth, validate(searchSchema, 'query'), search)

// GET /api/v1/user/suggestedusers - Get suggested users to connect with
userRouter.get("/suggestedusers", isAuth, getSuggestedUser)

export default userRouter