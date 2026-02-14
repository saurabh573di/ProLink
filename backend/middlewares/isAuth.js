/*
  middlewares/isAuth.js - JWT Authentication Middleware
  =================================================================================
  PURPOSE:
  - Verify JWT token from cookies and protect routes from unauthorized access
  
  FLOW:
  1. Extract token from req.cookies
  2. If missing or invalid, return 401 Unauthorized
  3. If valid, verify token using JWT_SECRET and extract userId
  4. Store userId in req.userId for downstream controllers
  5. Call next() to proceed
  
  USAGE:
  - Apply to routes that require authentication: const authRouter = express.Router();
  - authRouter.post('/logout', isAuth, logoutController)
  
  IMPORTANT:
  - Must be placed AFTER cookieParser middleware in the request chain
  - Token is validated on every protected request
  - Failed auth returns 401 status code
=================================================================================
*/
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()
const isAuth=async (req,res,next)=>{
    try {
        let {token}=req.cookies

        if(!token){
            return res.status(401).json({message:"user doesn't have token"})
        }
        let verifyToken= jwt.verify(token,process.env.JWT_SECRET)
        if(!verifyToken){
            return res.status(401).json({message:"user doesn't have valid token"})
        }
        
        req.userId=verifyToken.userId
        next()
    } catch (error) {
        console.log(error)
        return res.status(401).json({message:"is auth error"})
    }
}

export default isAuth