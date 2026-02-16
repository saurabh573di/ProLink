/*
  controllers/auth.controllers.js - Authentication Logic
  =================================================================================
  FUNCTIONS:
  
  1. signUp(firstName, lastName, userName, email, password)
     - Validates: email not in use, userName not in use, password >= 8 chars
     - Hashes password with bcrypt (salt rounds: 10)
     - Creates user document, generates 7-day JWT token
     - Sets HTTP-only cookie with secure/sameSite for production
     - Returns: 201 + user object (password excluded)
  
  2. login(email, password)
     - Finds user by email, compares password hash with bcrypt
     - On success: generates JWT, sets cookie, returns user object
     - Returns: 200 + user object (password excluded)
  
  3. logOut()
     - Clears token cookie with same secure/sameSite settings as signup
     - Returns: 200 + success message
  
  IMPORTANT:
  - Passwords are NEVER returned to frontend
  - Cookie settings: httpOnly=true (JS cannot access), secure in production only
  - sameSite="none" + secure=true for cross-origin requests in production (Render)
  - sameSite="lax" for dev (localhost, same domain)
  
  SECURITY NOTES:
  - Password validation: min 8 chars (consider adding complexity rules)
  - Duplicate check: verify both email and userName before creating
  - Use bcrypt rounds=10 for good balance of security vs performance
=================================================================================
*/
import genToken from "../config/token.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
export const signUp=async (req,res,next)=>{
    try {
        const {firstName,lastName,userName,email,password}=req.body
        
        // Normalize username to lowercase
        const normalizedUserName = userName.toLowerCase().trim()
        
        // Check if email exists
       let existEmail=await User.findOne({email})
       if(existEmail){
        return res.status(400).json({message:"email already exist !"})
       }
       
       // Check if username exists
       let existUsername=await User.findOne({userName: normalizedUserName})
       if(existUsername){
        return res.status(400).json({message:"userName already exist !"})
       }
       
       // Use normalized username
       const newUserData = {firstName, lastName, userName: normalizedUserName, email, password}
      
       let hassedPassword=await bcrypt.hash(password,10)
      
       const user=await User.create({
        ...newUserData,
        password:hassedPassword
       })

       let token=await genToken(user._id)
       res.cookie("token",token,{
        httpOnly:true,
        maxAge:7*24*60*60*1000,
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/"
       })
       
      // Exclude password from response
      const { password: _, ...userWithoutPassword } = user.toObject()
      return res.status(201).json(userWithoutPassword)

    } catch (error) {
        next(error)
    }
}

export const login=async (req,res,next)=>{
    try {
        const {email,password}=req.body
        let user=await User.findOne({email})
        if(!user){
         return res.status(400).json({message:"user does not exist !"})
        }

       const isMatch=await bcrypt.compare(password,user.password)
       if(!isMatch){
        return res.status(400).json({message:"incorrect password"})
       }
   
        let token=await genToken(user._id)
        res.cookie("token",token,{
         httpOnly:true,
         maxAge:7*24*60*60*1000,
         sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
         secure: process.env.NODE_ENV === "production",
         path: "/"
        })
       // Exclude password from response
       const { password: pwd, ...userWithoutPassword } = user.toObject()
       return res.status(200).json(userWithoutPassword)
    } catch (error) {
        next(error)
    }
}

export const logOut=async (req,res,next)=>{
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            path: "/"
        })
        return res.status(200).json({message:"log out successfully"})
    } catch (error) {
        next(error)
    }
}