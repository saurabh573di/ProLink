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

const Post=mongoose.model("Post",postSchema)
export default Post