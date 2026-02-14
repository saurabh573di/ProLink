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
