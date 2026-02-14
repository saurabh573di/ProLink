/*
  config/token.js - JWT Token Generation
  =================================================================================
  PURPOSE:
  - Generate signed JWT tokens for user authentication
  
  EXPORTED FUNCTION:
  - genToken(userId): Creates a JWT with userId payload, expires in 7 days
  
  USAGE:
  - Called in auth controllers when user logs in or signs up
  - Token is sent to client as an HTTP-only cookie via Set-Cookie header
  
  IMPORTANT:
  - Uses process.env.JWT_SECRET from .env file
  - Token contains only userId; password and sensitive data never included
  - Token expiry is 7 days; adjust expiresIn if needed
=================================================================================
*/
import jwt from "jsonwebtoken"

const genToken=async (userId)=>{
try {
let token= jwt.sign({userId},process.env.JWT_SECRET,{expiresIn:"7d"})
return token
} catch (error) {
    console.log(error);  
}
}

export default genToken