/*
  models/connection.model.js - Connection/Friend Request Schema
  =================================================================================
  FIELDS:
  - sender: User ID who initiated the connection request
  - receiver: User ID who received the connection request
  - status: "pending" | "accepted" | "rejected"
  - timestamps: createdAt, updatedAt for tracking request date
  
  WORKFLOW:
  1. User clicks "Connect": Create Connection(sender, receiver, status:"pending")
  2. Receiver accepts: Update status to "accepted" and add both to each other's connection list
  3. Receiver rejects: Update status to "rejected"
  
  INDEXES:
  - (sender, receiver): For checking if connection already exists
  - (receiver, status): For querying pending requests efficiently
  
  USAGE:
  - Check if already connected: Connection.findOne({sender, receiver, status:"accepted"})
  - Get pending requests: Connection.find({receiver, status:"pending"}).populate("sender")
  - Update status: Connection.updateOne({_id}, {status: "accepted"})
  
  IMPORTANT:
  - Only accepted connections should appear in User.connection array
  - Pending requests should NOT be in User.connection array yet
  - Need both (sender->receiver) and (receiver->sender) entries, or handle bidirectional separately
=================================================================================
*/
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