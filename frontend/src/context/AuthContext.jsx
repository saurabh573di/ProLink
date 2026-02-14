/**
 * ============================================
 * AUTHCONTEXT.JSX - Authentication Setup
 * ============================================
 * 
 * PURPOSE: Provides backend API URL to entire app
 * 
 * EXPORTS:
 * - serverUrl: Backend API base URL (from .env)
 * 
 * USAGE:
 * const { serverUrl } = useContext(authDataContext)
 * 
 * NOTE: This stores ONLY the server URL, not user authentication
 * User authentication (token, userData) is handled in UserContext
 */

import React, { createContext } from 'react'
export const authDataContext=createContext()

function AuthContext({children}) {
  // Get API URL from environment variables (.env file)
  const serverUrl=import.meta.env.VITE_API_BASE_URL
  
  // Context value object - passed to all child components
  let value={
    serverUrl
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
