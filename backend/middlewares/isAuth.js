import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()
const isAuth=async (req,res,next)=>{
    try {
        // Try to get token from Authorization header first (Bearer token)
        const authHeader = req.headers.authorization
        let token = null
        
        if(authHeader && authHeader.startsWith("Bearer ")){
            token = authHeader.slice(7) // Remove "Bearer " prefix
        } else {
            // Fallback to cookies for backward compatibility
            token = req.cookies.token
        }

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