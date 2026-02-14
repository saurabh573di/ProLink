/*
  models/post.model.js - Post Database Schema
  =================================================================================
  FIELDS:
  - author: Reference to User who created the post (required)
  - description: Text content of the post (default: empty string)
  - image: URL from Cloudinary (optional)
  - like: Array of user IDs who liked this post (for quick like counts and dedup)
  - comment: Array of comment objects, each with:
    * content: Comment text
    * user: Reference to the user who commented
  - timestamps: createdAt, updatedAt for sorting and notifications
  
  INDEXES:
  - author: For querying posts by specific user (profile page)
  - createdAt: For sorting posts by most recent (efficient feed queries)
  - like, comment.user: For like/comment queries and analytics
  
  USAGE:
  - Create post: new Post({ author, description, image })
  - Add like: Post.updateOne({_id}, {$push: {like: userId}})
  - Add comment: Post.updateOne({_id}, {$push: {comment: {content, user}}})
  - Get posts with users: Post.find().populate("author").populate("comment.user")
  
  IMPORTANT:
  - Use .populate("author") to get full user details in controllers
  - Like array should not contain duplicates; check before pushing with $addToSet
  - Comments are stored as embedded documents (not separate collection)
=================================================================================
*/
import mongoose from "mongoose"

const postSchema=new mongoose.Schema({
author:{
   type: mongoose.Schema.Types.ObjectId,
   ref:"User",
   required:true
},
description:{
    type:String,
    default:""
},
image:{
    type:String
},
like:[
   {
    type: mongoose.Schema.Types.ObjectId,
    ref:"User"
}
],
comment:[
    {
        content:{type:String},
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User" 
        }
    }
]


},{timestamps:true})

// Add indexes for performance
postSchema.index({ author: 1 })
postSchema.index({ createdAt: -1 })
postSchema.index({ like: 1 }) // Index for like queries
postSchema.index({ "comment.user": 1 }) // Index for comment queries

const Post=mongoose.model("Post",postSchema)
export default Post