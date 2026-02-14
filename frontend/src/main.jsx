/**
 * ============================================
 * MAIN.JSX - React Application Entry Point
 * ============================================
 * 
 * PURPOSE: Initialize the React app with all required providers
 * - Wraps app with context providers (Auth, User data)
 * - Sets up router (BrowserRouter for navigation)
 * - Enables lazy loading with Suspense
 * 
 * FLOW:
 * 1. AuthContext - Manages authentication state (serverUrl, user token)
 * 2. UserContext - Manages user data across app (userData, posts, profile)
 * 3. BrowserRouter - Enables page routing
 * 4. Suspense - Shows loading UI while pages are loading
 */

import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AuthContext from './context/AuthContext.jsx'
import UserContext from './context/UserContext.jsx'

/**
 * Loading component shown while lazy-loaded routes are loading
 * Prevents blank screen while page JS is downloading
 */
const LoadingFallback = () => (
  <div className='w-full h-screen flex items-center justify-center bg-[#f0efe7]'>
    <div className='text-gray-600 text-lg'>Loading...</div>
  </div>
)

createRoot(document.getElementById('root')).render(
 <BrowserRouter>
 <AuthContext>
<UserContext>
  {/* Suspense wrapper enables lazy loading for better performance */}
  <Suspense fallback={<LoadingFallback />}>
    <App />
  </Suspense>
</UserContext>
</AuthContext>
</BrowserRouter>
 
)
