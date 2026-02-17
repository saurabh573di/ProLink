/*
  Nav.jsx
  - Top navigation bar used across pages.
  - Features: search with debounce, quick navigation, profile popup and sign-out.
  - Performance notes: `handleSearch` is memoized with `useCallback` and debounced in `useEffect`.
*/
import React, { useContext, useEffect, useState, memo, useCallback } from 'react'
import logo2 from "../assets/logo2.png"
import { IoSearchSharp } from "react-icons/io5";
import { TiHome } from "react-icons/ti";
import { FaUserGroup } from "react-icons/fa6";
import { IoNotificationsSharp } from "react-icons/io5";
import dp from "../assets/dp.webp"
import { userDataContext } from '../context/UserContext';
import { authDataContext } from '../context/AuthContext';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';
function Nav() {
    let [activeSearch,setActiveSearch]=useState(false)
    let {userData,setUserData,handleGetProfile}=useContext(userDataContext)
    let [showPopup,setShowPopup]=useState(false)
    let navigate=useNavigate()
let {serverUrl}=useContext(authDataContext)
let [searchInput,setSearchInput]=useState("")
let [searchData,setSearchData]=useState([])
const handleSignOut=async ()=>{
    try {
        let result =await axios.get(serverUrl+"/api/v1/auth/logout",{withCredentials:true})
        setUserData(null)
        navigate("/login")
      
    } catch (error) {
        console.log(error);
    }
}

// PERFORMANCE: useCallback prevents search function recreation on every render
// This is important since it's used in useEffect dependency array
const handleSearch=useCallback(async ()=>{
  if(!searchInput.trim()) {
    setSearchData([])
    return
  }
  try {
    let result=await axios.get(`${serverUrl}/api/user/search?query=${searchInput}`,{withCredentials:true})
    // IMPORTANT: Ensure searchData is always an array to prevent ".map is not a function" errors
    setSearchData(Array.isArray(result.data) ? result.data : result.data?.users || [])
  } catch (error) {
    setSearchData([])
    console.log(error)
  }
}, [searchInput, serverUrl])

useEffect(()=>{
  // PERFORMANCE: Debounce search requests to reduce API calls
  // 300ms delay prevents firing search on every keystroke
  const delayTimer = setTimeout(() => {
    handleSearch()
  }, 300)
  return () => clearTimeout(delayTimer)
},[searchInput, handleSearch])


  return (
    <div className='w-full h-[80px] bg-[white] fixed top-0 shadow-lg flex justify-between md:justify-around items-center px-[10px] left-0 z-[80]'>
        <div className='flex justify-center items-center gap-[10px] '>
      <div onClick={()=>{
        setActiveSearch(false)
        navigate("/")
      }}>
        <img src={logo2}alt="" className='w-[50px]'/>
      </div>
      {!activeSearch && <div><IoSearchSharp className='w-[23px] h-[23px] text-gray-600 lg:hidden cursor-pointer hover:text-gray-800 transition-colors' onClick={()=>setActiveSearch(true)}/></div>}
      {searchData.length>0 &&   <div className='absolute top-[90px] h-[500px] left-[0px] lg:left-[60px] shadow-xl w-[100%] lg:w-[650px] bg-white flex flex-col gap-[0px] p-[15px] overflow-auto rounded-lg border border-gray-200'>
         {searchData.map((sea)=>(
          <div className='flex gap-[20px] items-center border-b-2 border-b-gray-200 p-[15px] hover:bg-gray-50 cursor-pointer rounded-lg transition-colors active:bg-gray-100' onClick={()=>handleGetProfile(sea.userName)} onTouchEnd={()=>handleGetProfile(sea.userName)}>
         <div className='w-[70px] h-[70px] rounded-full overflow-hidden flex-shrink-0'>
            <img src={sea.profileImage || dp} alt="" className='w-full h-full object-cover'/>
        </div>
        <div className='flex-1 min-w-0'>
        <div className='text-[19px] font-semibold text-gray-700 truncate'>{`${sea.firstName} ${sea.lastName}`}</div>
        <div className='text-[15px] text-gray-600 line-clamp-1'>{sea.headline}</div>
        </div>
          </div>
         ))}

      </div>}
     
    
      <form className={`w-[190px] lg:w-[350px] h-[40px] bg-white flex items-center gap-[10px] px-[12px] py-[5px] rounded-full border-2 border-gray-300 hover:border-gray-400 transition-colors focus-within:border-blue-500 focus-within:shadow-md ${!activeSearch?'hidden lg:flex':'flex'}`}>
     <div><IoSearchSharp className='w-[23px] h-[23px] text-gray-600'/></div>
     <input type="text" className='w-[80%] h-full bg-transparent outline-none border-0' placeholder='search users...' onChange={(e)=>setSearchInput(e.target.value)} value={searchInput} onFocus={()=>setActiveSearch(true)} onBlur={()=>setTimeout(()=>setActiveSearch(false), 200)}/>
      </form>
      </div>

      <div className='flex justify-center items-center gap-[20px] '>

{showPopup &&  <div className='w-[300px] min-h-[300px] bg-white shadow-lg absolute top-[75px] rounded-lg flex flex-col items-center p-[20px] gap-[20px] right-[20px] lg:right-[100px]'>
        <div className='w-[70px] h-[70px] rounded-full overflow-hidden'>
            <img src={userData.profileImage || dp} alt="" className='w-full h-full'/>
        </div>
        <div className='text-[19px] font-semibold text-gray-700'>{`${userData.firstName} ${userData.lastName}`}</div>
        <button className='w-[100%] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff]' onClick={()=>handleGetProfile(userData.userName)} onTouchEnd={()=>handleGetProfile(userData.userName)}>View Profile</button>
        <div className='w-full h-[1px] bg-gray-700 '></div>
        <div className='flex  w-full items-center justify-start text-gray-600 gap-[10px] cursor-pointer' onClick={()=>navigate("/network")}>
        <FaUserGroup className='w-[23px] h-[23px] text-gray-600 '/>
        <div>My Networks</div>
        </div>
        <button className='w-[100%] h-[40px] rounded-full border-2 border-[#ec4545] text-[#ec4545]' onClick={handleSignOut}>Sign Out</button>
        </div>
}
       


        <div className='lg:flex flex-col items-center justify-center cursor-pointer text-gray-600 hidden hover:text-gray-900 transition-colors hover:bg-gray-100 p-[8px] rounded-lg' onClick={()=>navigate("/")}>
        <TiHome className='w-[23px] h-[23px]'/>
        <div className='text-[12px]'>Home</div>
        </div>
        <div className='md:flex flex-col items-center justify-center text-gray-600 hidden cursor-pointer hover:text-gray-900 transition-colors hover:bg-gray-100 p-[8px] rounded-lg' onClick={()=>navigate("/network")}>
        <FaUserGroup className='w-[23px] h-[23px]'/>
        <div className='text-[12px]'>My Networks</div>
        </div>
        <div className='flex flex-col items-center justify-center text-gray-600 cursor-pointer hover:text-gray-900 transition-colors hover:bg-gray-100 p-[8px] rounded-lg' onClick={()=>navigate("/notification")}>
        <IoNotificationsSharp className='w-[23px] h-[23px]'/>
        <div className='hidden md:block text-[12px]'>Notifications</div>
        </div>
        <div className='w-[50px] h-[50px] rounded-full overflow-hidden cursor-pointer' onClick={()=>setShowPopup(prev=>!prev)}>
            <img src={userData.profileImage || dp} alt="" className='w-full h-full'/>
        </div>
      </div>
    </div>
  )
}

export default memo(Nav)
