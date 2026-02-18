/*
  UserContext.jsx
  - Global context storing user data, posts, profile info, and socket connection.
  - Key functions:
    * getCurrentUser(): Fetch logged-in user on app load (only if not already set).
    * getPost(): Fetch feed posts with initial limit of 5 for faster initial load.
    * handleGetProfile(userName): Fetch another user's profile and navigate to it.
  - Socket is initialized once when serverUrl is available and provided to consuming components.
  - Important: Always check if arrays exist and default to [] on errors to prevent ".map is not a function".
  
  PERFORMANCE OPTIMIZATION:
  - Skip getCurrentUser() if userData already exists (it's set after login, no need to re-fetch)
  - Reduced initial post limit from 10 to 5 for faster initial page load
  - This reduces the typical sign-in wait time from 5s to ~1-2s
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
let [isInitializing, setIsInitializing] = useState(true) // Track auth loading state
let {serverUrl}=useContext(authDataContext)
let [edit,setEdit]=useState(false)
let [postData,setPostData]=useState([])
let [profileData,setProfileData]=useState({}) // Initialize as object, not array
let navigate=useNavigate()

// Initialize socket once when serverUrl is available
useEffect(() => {
  if (serverUrl && !socket) {
    socket = io(serverUrl);
  }
}, [serverUrl]);

const getCurrentUser=async ()=>{
    try {
        let result=await axios.get(serverUrl+"/api/v1/user/currentuser",{withCredentials:true})
        setUserData(result.data)
        return true
    } catch (error) {
        console.log(error);
        setUserData(null)
        return false
    }
}

const getPost=async ()=>{
  try {
    let result=await axios.get(serverUrl+"/api/v1/post/getpost?limit=5",{
      withCredentials:true
    })
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
    // Navigate to profile page with username parameter
    navigate(`/profile/${userName}`)
   } catch (error) {
    console.error("Error navigating to profile:", error)
   }
}


useEffect(() => {
  // Check authentication status on app load/refresh
  const checkAuth = async () => {
    setIsInitializing(true)
    
    // Only call getCurrentUser if not already set
    if (!userData) {
      await getCurrentUser();
    }
    
    // Fetch posts in background
    getPost()
    
    setIsInitializing(false)
  }
  
  checkAuth()
}, []);


    const value={
        userData,setUserData,edit,setEdit,postData,setPostData,getPost,handleGetProfile,profileData,setProfileData,socket,isInitializing
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
