/*
    ConnectionButton.jsx
    - Small component that renders the connection action button for a profile.
    - Behavior depends on `status` returned by the server: e.g. "connect", "pending",
        "received", "disconnect". Button triggers send/remove requests or navigates to requests.
    - Listens to socket `statusUpdate` events to keep the label in sync in real-time.
*/
import React, { useContext, useEffect, useState } from 'react'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { userDataContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'

function ConnectionButton({userId}) {
let {serverUrl}=useContext(authDataContext)
let {userData,setUserData,socket}=useContext(userDataContext)
let [status,setStatus]=useState("")
let navigate=useNavigate()
    const handleSendConnection=async ()=>{
        try {
            let result=await axios.post(`${serverUrl}/api/connection/send/${userId}`,{},{withCredentials:true})
            console.log(result)
            
        } catch (error) {
            console.log(error)
        }
    }
    const handleRemoveConnection=async ()=>{
        try {
            let result=await axios.delete(`${serverUrl}/api/connection/remove/${userId}`,{withCredentials:true})
            console.log(result)
        } catch (error) {
            console.log(error)
        }
    }
    const handleGetStatus=async ()=>{
        try {
            let result=await axios.get(`${serverUrl}/api/connection/getStatus/${userId}`,{withCredentials:true})
            console.log(result)
            setStatus(result.data.status)
            
        } catch (error) {
            console.log(error)
        }
    }

useEffect(()=>{
    if(!socket) return;
    socket.emit("register",userData._id)
    handleGetStatus()

        socket.on("statusUpdate",({updatedUserId,newStatus})=>{
            // Only update if the update concerns the currently viewed user
            if(updatedUserId.toString()===userId.toString()){
                setStatus(newStatus)
            }
        })

    return ()=>{
        if(socket) socket.off("statusUpdate")
    }

},[userId,socket])

const handleClick=async ()=>{
        // Use strict comparisons for predictable behavior
        if(status === "disconnect"){
            await handleRemoveConnection()
        } else if(status === "received"){
                navigate("/network")
        } else {
            await handleSendConnection()
        }
}

    return (
        <button className='min-w-[110px] h-[40px] md:min-w-[120px] md:h-[44px] px-[15px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] text-[14px] md:text-[16px] font-semibold hover:bg-[#2dc0ff] hover:text-white transition-all active:scale-95 touch-manipulation' onClick={handleClick} disabled={status === "pending"}>{status}</button>
    )
}

export default ConnectionButton
