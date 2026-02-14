/*
  routes/post.routes.js - Post Management Routes
  =================================================================================
  ENDPOINTS:
  - POST /api/post/create [AUTH + MULTIPART] : Create new post (optional image)
  - GET /api/post/getpost [AUTH] : Fetch all posts (paginated, default 10/page)
  - GET /api/post/like/:postId [AUTH] : Like/unlike post (toggle)
  - POST /api/post/comment/:postId [AUTH] : Add comment to post (requires content)
  
  NOTES:
  - createPost uses multer.single("image") for optional post image
  - like endpoint uses GET for simplicity (POST would be more REST-ful but works)
  - All endpoints populate author and comment.user for frontend display
  - Socket events emitted for real-time updates to all connected clients
=================================================================================
*/
import express from "express"
import isAuth from "../middlewares/isAuth.js"
import upload from "../middlewares/multer.js"
import { comment, createPost, getPost, like } from "../controllers/post.Controllers.js"
const postRouter=express.Router()

postRouter.post("/create",isAuth,upload.single("image"),createPost)
postRouter.get("/getpost",isAuth,getPost)
postRouter.get("/like/:id",isAuth,like)
postRouter.post("/comment/:id",isAuth,comment)


export default postRouter