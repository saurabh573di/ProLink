/*
  controllers/post.controllers.js - Post Creation & Interaction
  =================================================================================
  FUNCTIONS:
  
  1. createPost(description, image) - [AUTH + MULTIPART]
     - Creates new post with author=req.userId and optional image
     - Image uploaded to Cloudinary if req.file exists
     - Returns: 201 + new post object
  
  2. getPost(page, limit) - [AUTH]
     - Fetches paginated posts (default: 10 per page)
     - Populates author with basic info (firstName, lastName, profileImage, headline, userName)
     - Populates comment.user with basic info
     - Sorted by createdAt descending (newest first)
     - Returns: posts array + total count + pagination info
  
  3. like(postId) - [AUTH]
     - OPTIMISTIC UI + ATOMIC DB UPDATE
     - Uses $addToSet (never duplicates) and $pull (removes)
     - Creates "like" notification (if user is not post author)
     - Deletes notification if user unlikes
     - Emits socket event "likeUpdated" to all connected users
     - Returns: minimal response {success: true, likes: [userIds]}
  
  4. comment(postId, content) - [AUTH]
     - Adds comment to post (embeds user + content)
     - Populates comment.user with author info
     - Creates "comment" notification (if user is not post author)
     - Emits socket event "commentAdded" to all connected users
     - Returns: updated post object with all comments
  
  IMPORTANT:
  - Like: use $addToSet to prevent duplicate likes (idempotent)
  - Like: use $pull to remove from array (unlike)
  - Socket events ensure real-time updates for all connected clients
  - Notifications: never notify post author for their own actions
  - Always populate author and comment.user for frontend display
  
  PERFORMANCE NOTES:
  - Like: uses $meta textScore in post fetch for minimal data
  - Comment: fully populates due to nested structure
  - Consider pagination for posts if dataset grows large
=================================================================================
*/
import Post from "../models/post.model.js"
import uploadOnCloudinary from "../config/cloudinary.js"
import { io } from "../index.js";
import Notification from "../models/notification.model.js";
export const createPost=async (req,res,next)=>{
    try {
        let {description}=req.body
        let newPost;
    if(req.file){
        let image=await uploadOnCloudinary(req.file.buffer)
         newPost=await Post.create({
            author:req.userId,
            description,
            image
        })
    }else{
        newPost=await Post.create({
            author:req.userId,
            description
        })
    }
return res.status(201).json(newPost)

    } catch (error) {
        next(error)
    }
}


export const getPost=async (req,res,next)=>{
    try {
        const page = req.query.page ? parseInt(req.query.page) : 0
        const limit = req.query.limit ? parseInt(req.query.limit) : 10
        const skip = page * limit

        // OPTIMIZATION: Use parallel queries to reduce total response time
        const [post, total] = await Promise.all([
            Post.find()
            .populate("author","firstName lastName profileImage headline userName")
            .populate("comment.user","firstName lastName profileImage headline")
            .sort({createdAt:-1})
            .limit(limit)
            .skip(skip),
            Post.countDocuments()
        ])
        
        return res.status(200).json({
            posts: post,
            total,
            page,
            pages: Math.ceil(total / limit)
        })
    } catch (error) {
        next(error)
    }
}

export const like =async (req,res,next)=>{
    try {
        let postId=req.params.id
        let userId=req.userId
        
        // 🔥 Check if user already liked
        const post = await Post.findById(postId);
        if(!post){
            return res.status(400).json({message:"post not found"})
        }
        
        const alreadyLiked = post.like.some(id => id.toString() === userId);
        
        // ⚡ ATOMIC UPDATE: Use MongoDB operators (much faster than find-modify-save)
        if(alreadyLiked){
            // Unlike: Remove from likes array
            await Post.findByIdAndUpdate(
                postId,
                { $pull: { like: userId } },
                { new: false }
            );
            
            // Delete the notification when user unlikes
            await Notification.findOneAndDelete({
                receiver:post.author,
                type:"like",
                relatedUser:userId,
                relatedPost:postId
            })
        }else{
            // Like: Add to likes array (only if not already exists)
            await Post.findByIdAndUpdate(
                postId,
                { $addToSet: { like: userId } },
                { new: false }
            );
            
            // Create notification only if not the post author
            if(post.author.toString() !== userId){
                await Notification.create({
                    receiver:post.author,
                    type:"like",
                    relatedUser:userId,
                    relatedPost:postId
                })
            }
        }
        
        // 🚀 Fetch updated likes array only (minimal data)
        const updatedPost = await Post.findById(postId).select('like');
        
        // 📡 Emit socket event with minimal data
        io.emit("likeUpdated",{postId, likes: updatedPost.like})
       
        // ⚡ Return minimal response for client (not entire post)
        return res.status(200).json({ 
            success: true,
            likes: updatedPost.like 
        })

    } catch (error) {
      return res.status(500).json({message:`like error ${error}`})  
    }
}

export const comment=async (req,res,next)=>{
    try {
        let postId=req.params.id
        let userId=req.userId
        let {content}=req.body

        let post=await Post.findByIdAndUpdate(postId,{
            $push:{comment:{content,user:userId}}
        },{new:true})
        .populate("comment.user","firstName lastName profileImage headline")
        if(post.author.toString() !== userId){
        let notification=await Notification.create({
            receiver:post.author,
            type:"comment",
            relatedUser:userId,
            relatedPost:postId
        })
    }
        io.emit("commentAdded",{postId,comm:post.comment})
        return res.status(200).json(post)

    } catch (error) {
        next(error)  
    }
}