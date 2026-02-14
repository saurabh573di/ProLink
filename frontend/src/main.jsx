import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AuthContext from './context/AuthContext.jsx'
import UserContext from './context/UserContext.jsx'

// Loading component shown while lazy-loaded routes are loading
const LoadingFallback = () => (
  <div className='w-full h-screen flex items-center justify-center bg-[#f0efe7]'>
    <div className='text-gray-600 text-lg'>Loading...</div>
  </div>
)

creatRoot(document.getElementById('root')).render(
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
