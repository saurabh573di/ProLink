/*
  routes/post.routes.js - Post Management Routes
  =================================================================================
  ENDPOINTS:
  - POST /api/v1/post/create [AUTH + MULTIPART] : Create new post (optional image)
  - GET /api/v1/post/getpost [AUTH] : Fetch all posts (paginated, default 10/page)
  - GET /api/v1/post/like/:postId [AUTH] : Like/unlike post (toggle)
  - POST /api/v1/post/comment/:postId [AUTH] : Add comment to post (requires content)
  
  NOTES:
  - createPost uses multer.single("image") for optional post image
  - like endpoint uses GET for simplicity (POST would be more REST-ful but works)
  - All endpoints populate author and comment.user for frontend display
  - Socket events emitted for real-time updates to all connected clients
  - All endpoints include Joi validation
=================================================================================
*/
import express from "express"
import isAuth from "../middlewares/isAuth.js"
import upload from "../middlewares/multer.js"
import { comment, createPost, getPost, like } from "../controllers/post.Controllers.js"
import validate from "../middlewares/validate.js"
import { createPostSchema, getPostSchema, commentSchema, likePostSchema } from "../validators/post.validator.js"

const postRouter = express.Router()

// POST /api/v1/post/create - Create new post with optional image
// Validates: description (optional, max 5000 chars), image (optional, max 10MB)
postRouter.post("/create", isAuth, upload.single("image"), validate(createPostSchema), createPost)

// GET /api/v1/post/getpost - Fetch paginated posts
// Validates: page and limit query parameters
postRouter.get("/getpost", isAuth, validate(getPostSchema, 'query'), getPost)

// GET /api/v1/post/like/:postId - Toggle like on post
postRouter.get("/like/:id", isAuth, validate(likePostSchema, 'params'), like)

// POST /api/v1/post/comment/:postId - Add comment to post
// Validates: content (required, 1-1000 characters)
postRouter.post("/comment/:id", isAuth, validate(commentSchema), comment)

export default postRouter