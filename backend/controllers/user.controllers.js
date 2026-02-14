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
        let user=await User.findOne({userName}).select("-password")
        if(!user){
            return res.status(400).json({message:"userName does not exist"})
        }
        return res.status(200).json(user)
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:`get profile error ${error}`})
    }
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