/*
  controllers/notification.controllers.js - User Notifications
  =================================================================================
  FUNCTIONS:
  
  1. getNotifications() - [AUTH]
     - Fetches all notifications for logged-in user
     - Sorted by createdAt descending (newest first)
     - Populates relatedUser with firstName, lastName, profileImage
     - Populates relatedPost with image, description
     - Used on Notification page to display activity feed
  
  2. deleteNotification(notificationId) - [AUTH]
     - Deletes single notification for authenticated user
     - Validates that receiver === current user (cannot delete others' notifications)
     - Used when user clicks X on individual notification
  
  3. clearAllNotifications() - [AUTH]
     - Deletes all notifications for current user
     - Used for "Clear All" button on Notification page
  
  NOTIFICATION TYPES:
  - "like": Someone liked your post (relatedUser=liker, relatedPost=post)
  - "comment": Someone commented on your post (relatedUser=commenter, relatedPost=post)
  - "connectionAccepted": Someone accepted your connection request (relatedUser=accepter, relatedPost=null)
  
  IMPORTANT:
  - Created automatically by post.controllers (like, comment) and connection.controllers (accept)
  - No manual creation by user
  - receiver is always the person being notified
  - relatedPost is null for connectionAccepted type
  - Notifications persist indefinitely; consider adding TTL or limiting history
  
  FUTURE IMPROVEMENTS:
  - Add "seen" or "read" boolean field to mark as read
  - Add TTL index to auto-delete after 30 days
  - Real-time push via socket when notification created
=================================================================================
*/
import Notification from "../models/notification.model.js"

export const getNotifications=async (req,res)=>{
    try {
        
    let notification=await Notification.find({receiver:req.userId})
    .sort({createdAt:-1})
    .populate("relatedUser","firstName lastName profileImage")
    .populate("relatedPost","image description")
    return res.status(200).json(notification)
    } catch (error) {
        return res.status(500).json({message:`get notification error ${error}`})
    }
}
export const deleteNotification=async (req,res)=>{
    try {
        let {id}=req.params
   await Notification.findOneAndDelete({
    _id:id,
    receiver:req.userId
   })
    return res.status(200).json({message:" notification deleted successfully"})
    } catch (error) {
        return res.status(500).json({message:`delete notification error ${error}`})
    }
}
export const clearAllNotification=async (req,res)=>{
    try {
   await Notification.deleteMany({
    receiver:req.userId
   })
    return res.status(200).json({message:" notification deleted successfully"})
    } catch (error) {
        return res.status(500).json({message:`delete all notification error ${error}`})
    }
}