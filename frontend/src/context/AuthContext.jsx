import React, { createContext, useEffect, useState } from 'react'
import axios from 'axios'

export const authDataContext=createContext()

function AuthContext({children}) {
const serverUrl=import.meta.env.VITE_API_BASE_URL
const [token, setToken] = useState(null)
const [loading, setLoading] = useState(true)

// Load token from localStorage on mount
useEffect(() => {
  const savedToken = localStorage.getItem('authToken')
  if(savedToken){
    setToken(savedToken)
    // Set default Authorization header
    axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`
  }
  setLoading(false)
}, [])

// Function to save token
const saveToken = (newToken) => {
  localStorage.setItem('authToken', newToken)
  setToken(newToken)
  axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
}

// Function to logout (remove token)
const clearToken = () => {
  localStorage.removeItem('authToken')
  setToken(null)
  delete axios.defaults.headers.common['Authorization']
}

let value={
  serverUrl,
  token,
  saveToken,
  clearToken,
  loading
}

  return (
    <div>
     <authDataContext.Provider value={value}> 
     {children}
     </authDataContext.Provider> 
    </div>
  )
}

export default AuthContext
