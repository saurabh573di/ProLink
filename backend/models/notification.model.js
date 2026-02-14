/*
  models/notification.model.js - Notification Schema
  =================================================================================
  FIELDS:
  - receiver: User ID who receives the notification
  - type: "like" | "comment" | "connectionAccepted"
    * "like": Someone liked receiver's post
    * "comment": Someone commented on receiver's post
    * "connectionAccepted": A pending connection request was accepted
  - relatedUser: User ID of the person who performed the action (liker, commenter, etc.)
  - relatedPost: Post ID involved (populated for like/comment, null for connection)
  - timestamps: createdAt for sorting
  
  USAGE EXAMPLES:
  - Post liked: new Notification({receiver, type:"like", relatedUser, relatedPost})
  - Reply commented: new Notification({receiver, type:"comment", relatedUser, relatedPost})
  - Connection accepted: new Notification({receiver, type:"connectionAccepted", relatedUser})
  
  QUERYING:
  - Get user notifications: Notification.find({receiver}).populate("relatedUser").populate("relatedPost")
  - Get unread (all): Frontend marks as read on load, backend stores all
  - Delete old: Notification.deleteOne({_id})
  
  IMPORTANT:
  - relatedPost is null for "connectionAccepted" notifications
  - When populating, always populate relatedUser to show who acted
  - Consider adding seen/read status field if notifications need marking as read
  - Limit notifications per user to prevent unbounded growth (e.g., keep only 30 days)
=================================================================================
*/
import mongoose from "mongoose"

const notificationSchema=new mongoose.Schema({

    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    type:{
        type:String,
        enum:["like","comment","connectionAccepted"]
    },
    relatedUser:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    relatedPost:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
    }


},{timestamps:true})

const Notification=mongoose.model("Notification",notificationSchema)

export default Notification