/*
  routes/user.routes.js - User Profile Routes
  =================================================================================
  ENDPOINTS:
  - GET /api/user/currentuser [AUTH] : Get logged-in user's full profile
  - GET /api/user/profile/:userName [AUTH] : Get any user's profile by userName
  - GET /api/user/search?query= [AUTH] : Search users by name/skills (text + regex fallback)
  - GET /api/user/suggestedusers [AUTH] : Get users not in your network
  - PUT /api/user/updateprofile [AUTH + MULTIPART] : Update profile (fields + images)
  
  NOTES:
  - updateProfile uses multer.fields() for profileImage and coverImage files
  - All user endpoints require isAuth middleware
  - Profile endpoints return password-excluded user objects
=================================================================================
*/
import express from "express"
import { getCurrentUser, getprofile, getSuggestedUser, search, updateProfile } from "../controllers/user.controllers.js"
import isAuth from "../middlewares/isAuth.js"
import upload from "../middlewares/multer.js"

let userRouter=express.Router()

userRouter.get("/currentuser",isAuth,getCurrentUser)
userRouter.put("/updateprofile",isAuth,upload.fields([
   {name:"profileImage",maxCount:1} ,
   {name:"coverImage",maxCount:1}
]),updateProfile)
userRouter.get("/profile/:userName",isAuth,getprofile)
userRouter.get("/search",isAuth,search)
userRouter.get("/suggestedusers",isAuth,getSuggestedUser)
export default userRouter