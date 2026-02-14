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
if(updatedUserId.toString()===userId.toString()){
    setStatus(newStatus)
}
    })

    return ()=>{
        if(socket) socket.off("statusUpdate")
    }

},[userId,socket])

const handleClick=async ()=>{
    if(status=="disconnect"){
      await handleRemoveConnection()
    }else if(status=="received"){
        navigate("/network")
    }else{
await handleSendConnection()
    }
}

  return (
    <button className='min-w-[100px] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff]' onClick={handleClick} disabled={status=="pending"}>{status}</button>
  )
}

export default ConnectionButton
