/*
  controllers/user.controllers.js - User Profile Management
  =================================================================================
  FUNCTIONS:
  
  1. getCurrentUser() - [AUTH REQUIRED]
     - Fetches logged-in user by req.userId from JWT
     - Excludes password field for security
     - Used on app load to populate UserContext
  
  2. updateProfile(firstName, lastName, userName, headline, location, gender, skills, education, experience, profileImage, coverImage) - [AUTH + MULTIPART]
     - Updates all mutable user fields
     - Handles file uploads: profileImage and coverImage from req.files
     - Uploads images to Cloudinary and stores URLs in database
     - skills, education, experience are JSON strings; parsed before save
     - Returns updated user object (password excluded)
  
  3. getProfile(userName) - [PUBLIC]
     - Fetches any user's profile by userName
     - Excludes password field
     - Used for viewing other user profiles
  
  4. search(query) - [AUTH]
     - Full-text search on firstName, lastName, userName, skills
     - Uses MongoDB text search with scoring
     - Fallback to regex search if text index fails ($options: "i" for case-insensitive)
     - Limits results to 20 users
     - Returns: firstName, lastName, userName, profileImage, headline, skills only
  
  5. getSuggestedUsers() - [AUTH]
     - Returns users NOT in current user's connection list
     - Excludes the user themselves
     - Used for discovery/networking suggestions
     - Returns: 50 random suggested users
  
  IMPORTANT:
  - Always exclude password from responses: .select("-password")
  - Images need multipart/form-data middleware (multer configured in index.js)
  - Text search requires index on model: userSchema.index({field: "text"})
  - Use try-catch for fallback: text search may fail if index doesn't exist yet
=================================================================================
*/
import uploadOnCloudinary from "../config/cloudinary.js"
import User from "../models/user.model.js"

export const getCurrentUser=async (req,res)=>{
    try {
        let id=req.userId  
        const user=await User.findById(id).select("-password")
        if(!user){
            return res.status(400).json({message:"user does not found"})
        }

        return res.status(200).json(user)
    } catch (error) {
        console.log(error);
        
        return res.status(400).json({message:"get current user error"})
    }
}


export const updateProfile=async (req,res)=>{
    try {
       let {firstName,lastName,userName,headline,location,gender} =req.body
       let skills=req.body.skills?JSON.parse(req.body.skills):[]
       let education=req.body.education?JSON.parse(req.body.education):[]
       let experience=req.body.experience?JSON.parse(req.body.experience):[]
   let profileImage;
   let coverImage
   console.log(req.files)
       if(req.files && req.files.profileImage){
        profileImage=await uploadOnCloudinary(req.files.profileImage[0].buffer)
       }
       if(req.files && req.files.coverImage){
        coverImage=await uploadOnCloudinary(req.files.coverImage[0].buffer)
       }

       let user=await User.findByIdAndUpdate(req.userId,{
        firstName,lastName,userName,headline,location,gender,skills,education,experience,profileImage,coverImage
       },{new:true}).select("-password")
       return res.status(200).json(user)

    } catch (error) {
        console.log(error)
        return res.status(500).json({message:`update profile error ${error}`})
    }
}


export const getprofile=async (req,res)=>{
    try {
        let {userName}=req.params
        // Case-insensitive search using regex to handle existing users with spaces (e.g. "Mobile D")
        // This regex escapes special characters and performs case-insensitive match
        let user=await User.findOne({
            userName: new RegExp('^' + userName.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i')
        }).select("-password")
        if(!user){
            // Use 404 Not Found instead of 400 Bad Request for better HTTP semantics
            return res.status(404).json({message:"User not found"})
        }
        return res.status(200).json(user)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:`get profile error ${error}`})
    }


export const search=async (req,res)=>{
    try {
        let {query}=req.query
        if(!query || query.trim() === ""){
            return res.status(200).json([])
        }
        // Use text search for better performance on large datasets
        let users=await User.find(
            { $text: { $search: query } },
            { score: { $meta: "textScore" } }
        )
        .select("firstName lastName userName profileImage headline skills")
        .sort({ score: { $meta: "textScore" } })
        .limit(20)
        
        return res.status(200).json(users)
    } catch (error) {
        // Fallback to regex if text search fails
        try {
            let {query}=req.query
            let users=await User.find({
                $or:[
                    {firstName:{$regex:query,$options:"i"}},
                    {lastName:{$regex:query,$options:"i"}},
                    {userName:{$regex:query,$options:"i"}},
                    {skills:{$regex:query,$options:"i"}}
                ]
            }).select("firstName lastName userName profileImage headline skills").limit(20)
            return res.status(200).json(users)
        } catch (fallbackError) {
            console.log(fallbackError)
            return res.status(500).json({message:`search error ${fallbackError}`})
        }
    }
}

export const getSuggestedUser=async (req,res)=>{
    try {
        let currentUser=await User.findById(req.userId).select("connection")

        let suggestedUsers=await User.find({
            _id:{
                $ne:req.userId,
                $nin:currentUser.connection
            }
           
        }).select("-password")

        return res.status(200).json(suggestedUsers)

    } catch (error) {
        console.log(error)
        return res.status(500).json({message:`suggestedUser error ${error}`})
    }
}