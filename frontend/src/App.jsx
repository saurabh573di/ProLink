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
  let {userData}=useContext(userDataContext)
  return (
   <Routes>
    <Route path='/' element={userData?<Home/>:<Navigate to="/login"/>}/>
    <Route path='/signup' element={userData?<Navigate to="/"/>:<Signup/>}/>
    <Route path='/login' element={userData?<Navigate to="/"/>:<Login/>}/>
    <Route path='/network' element={userData?<Network/>:<Navigate to="/login"/>}/>
    <Route path='/profile' element={userData?<Profile/>:<Navigate to="/login"/>}/>
    <Route path='/notification' element={userData?<Notification/>:<Navigate to="/login"/>}/>
  
   </Routes>
  )
}

export default App
