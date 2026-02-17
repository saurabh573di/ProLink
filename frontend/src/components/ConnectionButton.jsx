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
let [showDialog,setShowDialog]=useState(false)
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
            setShowDialog(false)
        } catch (error) {
            console.log(error)
            setShowDialog(false)
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
            setShowDialog(true)
        } else if(status === "received"){
                navigate("/network")
        } else {
            await handleSendConnection()
        }
}

    return (
        <>
            <button className='min-w-[110px] h-[40px] md:min-w-[120px] md:h-[44px] px-[15px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] text-[14px] md:text-[16px] font-semibold hover:bg-[#2dc0ff] hover:text-white transition-all active:scale-95 touch-manipulation' onClick={handleClick} disabled={status === "pending"}>{status}</button>
            
            {/* Disconnect Confirmation Dialog */}
            {showDialog && (
                <div className='fixed inset-0 z-[1000] flex items-center justify-center'>
                    <div className='fixed inset-0 bg-black opacity-50' onClick={() => setShowDialog(false)}></div>
                    <div className='relative bg-white rounded-lg shadow-lg p-[32px] max-w-[400px] w-[90%]'>
                        <h2 className='text-[20px] font-bold text-gray-900 mb-[12px]'>Disconnect from user?</h2>
                        <p className='text-[15px] text-gray-600 mb-[24px] leading-relaxed'>Are you sure you want to disconnect from this user? You can send a new connection request later.</p>
                        
                        <div className='flex gap-[12px] justify-end'>
                            <button 
                                onClick={() => setShowDialog(false)}
                                className='px-[20px] py-[10px] rounded-lg border border-gray-300 text-gray-800 hover:bg-gray-50 font-semibold transition-all text-[15px]'
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleRemoveConnection}
                                className='px-[20px] py-[10px] rounded-lg bg-red-600 text-white hover:bg-red-700 font-semibold transition-all text-[15px]'
                            >
                                Disconnect
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default ConnectionButton
