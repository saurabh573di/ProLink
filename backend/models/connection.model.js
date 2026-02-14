import mongoose from "mongoose";

let connectionSchema=new mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    status:{
        type:String,
        enum:["pending","accepted","rejected"],
        default:"pending"
    }

},{timestamps:true})

// Add index for performance
connectionSchema.index({ sender: 1, receiver: 1 })
connectionSchema.index({ receiver: 1, status: 1 })

const Connection=mongoose.model("Connection",connectionSchema)
export default Connection