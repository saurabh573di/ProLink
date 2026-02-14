/*
  middlewares/multer.js - File Upload Middleware
  =================================================================================
  PURPOSE:
  - Configure multer for handling file uploads from the frontend
  
  CONFIGURATION:
  - storage: memoryStorage() - stores files in RAM instead of disk
    Reason: Better for cloud uploads (Cloudinary), no temp files to clean up
  - fileSize limit: 10MB - prevents huge files from consuming server memory
  
  USAGE:
  - Apply to routes with file uploads: router.post('/create', upload.single('image'), controller)
  - Access uploaded file via req.file.buffer in controllers
  
  IMPORTANT:
  - Memory storage means entire file is loaded into RAM; watch for large files
  - 10MB limit matches Cloudinary free tier restrictions
  - For multiple files, use upload.array() instead of upload.single()
=================================================================================
*/
import multer from "multer"

// Use memory storage for better cloud upload handling
const storage = multer.memoryStorage()

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
})

export default upload
