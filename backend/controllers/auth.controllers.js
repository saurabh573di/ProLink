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
export const signUp=async (req,res)=>{
    try {
        const {firstName,lastName,userName,email,password}=req.body
        
        // Validate userName: no spaces, only alphanumeric, dots, dashes, underscores
        if(!userName || !/^[a-zA-Z0-9._-]+$/.test(userName)){
            return res.status(400).json({message:"Username can only contain letters, numbers, dots, dashes, and underscores (no spaces)"})
        }
        
        // Check if email exists
       let existEmail=await User.findOne({email})
       if(existEmail){
        return res.status(400).json({message:"email already exist !"})
       }
       
       // Normalize and check username
       const normalizedUserName = userName.toLowerCase().trim()
       let existUsername=await User.findOne({userName: normalizedUserName})
       if(existUsername){
        return res.status(400).json({message:"userName already exist !"})
       }
       if(password.length<8){
        return res.status(400).json({message:"password must be at least 8 characters"})
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
       
      return res.status(201).json(user)

    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"signup error"})
   
    }
}

export const login=async (req,res)=>{
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
       return res.status(200).json(user)
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"login error"})
    }
}

export const logOut=async (req,res)=>{
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            path: "/"
        })
        return res.status(200).json({message:"log out successfully"})
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"logout error"})
    }
}