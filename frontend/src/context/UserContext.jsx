/*
  UserContext.jsx
  - Global context storing user data, posts, profile info, and socket connection.
  - Key functions:
    * getCurrentUser(): Fetch logged-in user on app load.
    * getPost(): Fetch all posts for the home feed.
    * handleGetProfile(userName): Fetch another user's profile and navigate to it.
  - Socket is initialized once when serverUrl is available and provided to consuming components.
  - Important: Always check if arrays exist and default to [] on errors to prevent ".map is not a function".
*/
import React, { createContext, useContext, useEffect, useState } from 'react'
import { authDataContext } from './AuthContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import io from 'socket.io-client'
export const userDataContext=createContext()

let socket;

function UserContext({children}) {
let [userData,setUserData]=useState(null)
let {serverUrl}=useContext(authDataContext)
let [edit,setEdit]=useState(false)
let [postData,setPostData]=useState([])
let [profileData,setProfileData]=useState([])
let navigate=useNavigate()

// Initialize socket once when serverUrl is available
useEffect(() => {
  if (serverUrl && !socket) {
    socket = io(serverUrl);
  }
}, [serverUrl]);

const getCurrentUser=async ()=>{
    try {
        let result=await axios.get(serverUrl+"/api/user/currentuser",{withCredentials:true})
        setUserData(result.data)
        return
    } catch (error) {
        console.log(error);
        setUserData(null)
    }
}

const getPost=async ()=>{
  try {
    let result=await axios.get(serverUrl+"/api/post/getpost",{
      withCredentials:true
    })
    console.log(result)
    // IMPORTANT: Ensure postData is always an array to prevent ".map is not a function" errors
    // If API returns { posts: [] }, extract the posts array
    setPostData(Array.isArray(result.data) ? result.data : result.data?.posts || [])
   
  } catch (error) {
    console.log(error)
    // CRITICAL: Reset to empty array on error to prevent crashes
    setPostData([])
  }
}

const handleGetProfile=async (userName)=>{
   try {
    let result=await axios.get(serverUrl+`/api/user/profile/${userName}`,{
      withCredentials:true
    })
    setProfileData(result.data)
    navigate("/profile")
   } catch (error) {
    // Better error handling: 404 = not found, other errors = server issues
    if(error?.response?.status === 404) {
      console.log("User not found")
      alert("User profile not found. Please check the username.")
    } else {
      console.log(error)
      alert("Error loading profile. Please try again.")
    }
   }
}



useEffect(() => {
getCurrentUser();
 getPost()
}, []);


    const value={
        userData,setUserData,edit,setEdit,postData,setPostData,getPost,handleGetProfile,profileData,setProfileData,socket
    }
  return (
    <div>
        <userDataContext.Provider value={value}>
      {children}
      </userDataContext.Provider>
    </div>
  )
}

export default UserContext
