/*
  controllers/connection.controllers.js - Friend Connections & Requests
  =================================================================================
  FUNCTIONS:
  
  1. sendConnection(targetUserId) - [AUTH]
     - Validates: not the user themselves, not already connected, request not pending
     - Creates Connection record (sender, receiver, status="pending")
     - Sends socket event "statusUpdate" to both users in real-time
     - Receiver sees status="received", sender sees status="pending"
     - Returns: 200 + new connection request
  
  2. acceptConnection(connectionId) - [AUTH]
     - Updates connection status: "pending" -> "accepted"
     - Adds both users to each other's connection array (bidirectional)
     - Creates "connectionAccepted" notification for sender
     - Emits socket "statusUpdate" to both: status="disconnect"
     - Returns: 200 + success message
  
  3. rejectConnection(connectionId) - [AUTH]
     - Updates connection status: "pending" -> "rejected"
     - Does NOT add to connection arrays
     - No socket notification sent
     - Returns: 200 + success message
  
  4. getConnectionStatus(targetUserId) - [AUTH]
     - Returns current status between two users:
       * "disconnect": Already connected
       * "pending": Request sent by current user, awaiting approval
       * "received": Request sent by target user to current user
       * "Connect": No connection or pending request
     - Used by ConnectionButton component to show right label/action
  
  5. removeConnection(targetUserId) - [AUTH]
     - Removes both users from each other's connection array
     - Emits socket "statusUpdate" to both: status="Connect"
     - Used when user clicks disconnect/remove
  
  6. getConnectionRequests() - [AUTH]
     - Fetches all pending connection requests TO current user
     - Populates sender with firstName, lastName, email, userName, profileImage, headline
     - Used in Network page to show list of pending requests
  
  7. getUserConnections(userId) - [AUTH]
     - Fetches all ACCEPTED connections for a user
     - Populates each connection with basic user info
     - Used for viewing someone's connections
  
  IMPORTANT:
  - userSocketMap: stores userId->socketId mapping for targeted socket events
  - Connection must be bidirectional: both users added to each other's array
  - Status values: "pending" (awaiting), "accepted" (connected), "rejected" (denied)
  - Socket events keep UI in sync across tabs/devices in real-time
  - Always validate: not self, not already friends, request not pending
  
  SOCKET EVENTS EMITTED:
  - sendConnection: receiver gets "statusUpdate" with status="received"
  - sendConnection: sender gets "statusUpdate" with status="pending"
  - acceptConnection: both get "statusUpdate" with status="disconnect"
  - removeConnection: both get "statusUpdate" with status="Connect"
=================================================================================
*/

import Connection from "../models/connection.model.js"
import User from "../models/user.model.js"
import {io,userSocketMap} from "../index.js"
import Notification from "../models/notification.model.js"
export const sendConnection= async (req,res)=>{
    try {
        let {id}=req.params
        let sender=req.userId
 let user=await User.findById(sender)

 if(sender==id){
    return res.status(400).json({message:"you can not send request yourself"})
 }

 if(user.connection.some(connId => connId.toString() === id)){
    return res.status(400).json({message:"you are already connected"})
 }

 let existingConnection=await Connection.findOne({
    sender,
    receiver:id,
    status:"pending"
 })
 if(existingConnection){
    return res.status(400).json({message:"request already exist"})
 }

 let newRequest=await Connection.create({
  sender,
  receiver:id
 })

 let receiverSocketId=userSocketMap.get(id)
 let senderSocketId=userSocketMap.get(sender)

if(receiverSocketId){
io.to(receiverSocketId).emit("statusUpdate",{updatedUserId:sender,newStatus:"received"})
}
if(senderSocketId){
    io.to(senderSocketId).emit("statusUpdate",{updatedUserId:id,newStatus:"pending"})
}




 return res.status(200).json(newRequest)

    } 
    catch (error) {
      return res.status(500).json({message:`sendconnection error ${error}`}) 
    }
}

export const acceptConnection=async (req,res)=>{
    try {
        let {connectionId}=req.params
        let userId=req.userId
        let connection=await Connection.findById(connectionId)

        if(!connection){
            return res.status(400).json({message:"connection does not exist"})
        }
    
        if(connection.status!="pending"){
            return res.status(400).json({message:"request under process"})
        }


        connection.status="accepted"
         let notification=await Notification.create({
                    receiver:connection.sender,
                    type:"connectionAccepted",
                    relatedUser:userId,
                   
                })
        await connection.save()
        await User.findByIdAndUpdate(req.userId,{
            $addToSet:{connection:connection.sender}
        })
        await User.findByIdAndUpdate(connection.sender,{
            $addToSet:{connection:userId}
        })


        
 let receiverSocketId=userSocketMap.get(userId)
 let senderSocketId=userSocketMap.get(connection.sender.toString())

if(receiverSocketId){
io.to(receiverSocketId).emit("statusUpdate",{updatedUserId:connection.sender,newStatus:"disconnect"})
}
if(senderSocketId){
    io.to(senderSocketId).emit("statusUpdate",{updatedUserId:userId,newStatus:"disconnect"})
}

        return res.status(200).json({message:"connection accepted"})


    } catch (error) {
        return res.status(500).json({message:`connection accepted error ${error}`})
    }
}

export const rejectConnection=async (req,res)=>{
    try {
        let {connectionId}=req.params
        let connection=await Connection.findById(connectionId)

        if(!connection){
            return res.status(400).json({message:"connection does not exist"})
        }
        if(connection.status!="pending"){
            return res.status(400).json({message:"request under process"})
        }

        connection.status="rejected"
        await connection.save()

        return res.status(200).json({message:"connection rejected"})


    } catch (error) {
        return res.status(500).json({message:`connection rejected error ${error}`})
    }
}
export const getConnectionStatus = async (req, res) => {
	try {
		const targetUserId = req.params.userId;
		const currentUserId = req.userId;

        let currentUser=await User.findById(currentUserId)
		if (currentUser.connection.includes(targetUserId)) {
			return res.json({ status: "disconnect" });
		}

		const pendingRequest = await Connection.findOne({
			$or: [
				{ sender: currentUserId, receiver: targetUserId },
				{ sender: targetUserId, receiver: currentUserId },
			],
			status: "pending",
		});

		if (pendingRequest) {
			if (pendingRequest.sender.toString() === currentUserId.toString()) {
				return res.json({ status: "pending" });
			} else {
				return res.json({ status: "received", requestId: pendingRequest._id });
			}
		}

		// if no connection or pending req found
		return res.json({ status: "Connect" });
	} catch (error) {
		return res.status(500).json({ message: "getConnectionStatus error" });
	}
};


export const removeConnection = async (req, res) => {
	try {
		const myId = req.userId;
		const otherUserId = req.params.userId;

		await User.findByIdAndUpdate(myId, { $pull: { connection: otherUserId } });
		await User.findByIdAndUpdate(otherUserId, { $pull: { connection: myId } });
      
               
 let receiverSocketId=userSocketMap.get(otherUserId)
 let senderSocketId=userSocketMap.get(myId)

if(receiverSocketId){
io.to(receiverSocketId).emit("statusUpdate",{updatedUserId:myId,newStatus:"connect"})
}
if(senderSocketId){
    io.to(senderSocketId).emit("statusUpdate",{updatedUserId:otherUserId,newStatus:"connect"})
}

		return res.json({ message: "Connection removed successfully" });
	} catch (error) {
        console.log(error)
		return res.status(500).json({ message: "removeConnection error" });
	}
};


export const getConnectionRequests = async (req, res) => {
	try {
		const userId = req.userId;

		const requests = await Connection.find({ receiver: userId, status: "pending" }).populate("sender", "firstName lastName email userName profileImage headline")
     

		return res.status(200).json(requests);
	} catch (error) {
		console.error("Error in getConnectionRequests controller:", error);
		return res.status(500).json({ message: "Server error" });
	}
};


export const getUserConnections = async (req, res) => {
	try {
		const userId = req.userId;

		const user = await User.findById(userId).populate(
			"connection",
			"firstName lastName userName profileImage headline connection"
		);

		return res.status(200).json(user.connection);
	} catch (error) {
		console.error("Error in getUserConnections controller:", error);
		return res.status(500).json({ message: "Server error" });
	}
};