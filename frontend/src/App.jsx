/**
 * ============================================
 * APP.JSX - Main React Router Configuration
 * ============================================
 * 
 * PURPOSE: Central routing file that manages all page navigation
 * - Routes requests to different pages based on URL
 * - Protects routes (requires authentication)
 * - Redirects unauthenticated users to login
 * 
 * PAGES:
 * - / (Home): Main feed with posts
 * - /login: User login page
 * - /signup: User registration page
 * - /profile: User profile page (own profile)
 * - /network: Connection requests & connections list
 * - /notification: Notifications page
 * 
 * PERFORMANCE: Uses React.lazy() for code splitting
 * - Reduces initial bundle size
 * - Pages load only when needed
 */

import React, { useContext, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
// Lazy load pages for code splitting - improves initial page load performance
const Home = lazy(() => import('./pages/Home'))
const Signup = lazy(() => import('./pages/Signup'))
const Login = lazy(() => import('./pages/Login'))
const Network = lazy(() => import('./pages/Network'))
const Profile = lazy(() => import('./pages/Profile'))
const Notification = lazy(() => import('./pages/Notification'))

import { userDataContext } from './context/UserContext'

function App() {
  // Get user data and initializing state from context
  let {userData, isInitializing}=useContext(userDataContext)
  
  // Show loading screen while checking authentication status
  if (isInitializing) {
    return (
      <div className='w-full h-screen flex items-center justify-center bg-[#f0efe7]'>
        <div className='text-gray-600 text-lg'>Loading...</div>
      </div>
    )
  }
  
  return (
   <Routes>
    <Route path='/' element={userData?<Home/>:<Navigate to="/login"/>}/>
    <Route path='/signup' element={userData?<Navigate to="/"/>:<Signup/>}/>
    <Route path='/login' element={userData?<Navigate to="/"/>:<Login/>}/>
    <Route path='/network' element={userData?<Network/>:<Navigate to="/login"/>}/>
    <Route path='/profile/:username' element={userData?<Profile/>:<Navigate to="/login"/>}/>
    <Route path='/profile' element={userData?<Profile/>:<Navigate to="/login"/>}/>
    <Route path='/notification' element={userData?<Notification/>:<Navigate to="/login"/>}/>
   </Routes>
  )
}

export default App
