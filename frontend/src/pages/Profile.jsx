/*
    Profile.jsx
    - Displays a user's public profile including posts, skills, education and experience.
    - If viewing your own profile (`profileData._id === userData._id`) you can edit it via `EditProfile`.
    - `profilePost` is derived from global `postData` and filtered by the profile owner's id.
*/
import React, { useContext, useEffect, useState } from 'react'
import Nav from '../components/Nav'
import dp from "../assets/dp.webp"
import { FiPlus } from "react-icons/fi";
import { FiCamera } from "react-icons/fi";
import { userDataContext } from '../context/UserContext';
import { HiPencil } from "react-icons/hi2";
import { authDataContext } from '../context/AuthContext';
import axios from 'axios';
import EditProfile from '../components/EditProfile';
import Post from '../components/Post';
import ConnectionButton from '../components/ConnectionButton';
function Profile() {

    let {userData,setUserData,edit,setEdit,postData,setPostData,profileData,setProfileData}=useContext(userDataContext)
    // Local state for posts authored by the profile being viewed
    let [profilePost,setProfilePost]=useState([])
    
let {serverUrl}=useContext(authDataContext)
   
// Recompute the posts for this profile whenever `profileData` or `postData` change
useEffect(()=>{
    setProfilePost(postData.filter((post)=>post.author._id.toString()===profileData._id.toString()))
},[profileData, postData])

  return (
    <div className='w-full min-h-[100vh] bg-[#f0efe7] flex flex-col items-center pt-[120px] pb-[40px]'>
      <Nav/>
      {edit && <EditProfile/>}
      
      <div className='w-full max-w-[900px] min-h-[100vh] flex flex-col gap-[30px]'>

        <div className='relative bg-white rounded-lg shadow-lg overflow-hidden'>
            {/* Cover Image */}
            <div className='w-full h-[120px] bg-gradient-to-r from-blue-400 to-blue-300 overflow-hidden'>
              <img src={profileData.coverImage || ""} alt="" className='w-full h-full object-cover'/>
            </div>

            {/* Profile Info */}
            <div className='relative px-[20px]'>
              {/* Profile Picture */}
              <div className='flex items-end gap-[20px] -mt-[55px] mb-[15px]'>
                <div className='w-[100px] h-[100px] rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-lg flex items-center justify-center'>
                  <img src={profileData.profileImage || dp} alt="" className='w-full h-full object-cover' loading="lazy" onError={(e) => e.target.src = dp}/>
                </div>
                <div className='pb-[10px]'>
                  <h1 className='text-[28px] font-bold text-gray-900'>{`${profileData.firstName} ${profileData.lastName}`}</h1>
                  {profileData.headline && <p className='text-[16px] text-gray-600 mt-[2px]'>{profileData.headline}</p>}
                </div>
              </div>

              {/* Location & Connections */}
              <div className='flex gap-[30px] mb-[15px] text-[14px] text-gray-600'>
                {profileData.location && <span>{profileData.location}</span>}
                <span className='font-semibold text-gray-900'>{profileData.connection.length} {profileData.connection.length === 1 ? 'connection' : 'connections'}</span>
              </div>

              {/* Action Buttons */}
              <div className='flex gap-[10px] pb-[20px]'>
                {profileData._id==userData._id && (
                  <button className='px-[24px] py-[10px] rounded-full bg-blue-600 text-white font-semibold text-[15px] hover:bg-blue-700 transition-all flex items-center gap-[8px]' onClick={()=>setEdit(true)}>
                    <HiPencil className='w-[18px] h-[18px]' />
                    Edit Profile
                  </button>
                )}
                {profileData._id!=userData._id && <div className="touch-manipulation"><ConnectionButton userId={profileData._id}/></div>}
              </div>
            </div>
        </div>
<div className='w-full bg-white shadow-lg rounded-lg p-[20px] border-b border-gray-200'>
  <h2 className='text-[22px] font-bold text-gray-900'>{`Posts`} <span className='text-gray-500 font-normal'>{`(${profilePost.length})`}</span></h2>
</div>

{profilePost.map((post,index)=>(
    <Post key={index} id={post._id} description={post.description} author={post.author} image={post.image} like={post.like} comment={post.comment} createdAt={post.createdAt}/>
))}
{profileData.skills.length>0 && <div className='w-full bg-white shadow-lg rounded-lg overflow-hidden'>
    <div className='px-[20px] pt-[20px] pb-[15px] border-b border-gray-200 flex justify-between items-center'>
      <h2 className='text-[22px] font-bold text-gray-900'>Skills</h2>
      {profileData._id==userData._id && <button onClick={()=>setEdit(true)} className='h-[40px] px-[16px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] text-[14px] font-semibold hover:bg-blue-50 transition-all'>+ Add</button>}
    </div>
    <div className='p-[20px] flex flex-wrap gap-[10px]'>
      {profileData.skills.map((skill, index)=>(
        <div key={index} className='bg-blue-100 text-blue-800 px-[14px] py-[8px] rounded-full text-[15px] font-medium'>{skill}</div>
      ))}
    </div>
  </div>}
{profileData.education.length>0 && <div className='w-full bg-white shadow-lg rounded-lg overflow-hidden'>
    <div className='px-[20px] pt-[20px] pb-[15px] border-b border-gray-200 flex justify-between items-center'>
      <h2 className='text-[22px] font-bold text-gray-900'>Education</h2>
      {profileData._id==userData._id && <button onClick={()=>setEdit(true)} className='h-[40px] px-[16px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] text-[14px] font-semibold hover:bg-blue-50 transition-all'>+ Add</button>}
    </div>
    <div className='divide-y divide-gray-200'>
      {profileData.education.map((edu, index)=>(
        <div key={index} className='px-[20px] py-[16px] hover:bg-gray-50 transition-all'>
          <h3 className='text-[16px] font-bold text-gray-900'>{edu.college}</h3>
          <p className='text-[15px] text-gray-600 mt-[4px]'>{edu.degree}</p>
          <p className='text-[14px] text-gray-500 mt-[2px]'>{edu.fieldOfStudy}</p>
        </div>
      ))}
    </div>
  </div>}
{profileData.experience.length>0 && <div className='w-full bg-white shadow-lg rounded-lg overflow-hidden'>
    <div className='px-[20px] pt-[20px] pb-[15px] border-b border-gray-200 flex justify-between items-center'>
      <h2 className='text-[22px] font-bold text-gray-900'>Experience</h2>
      {profileData._id==userData._id && <button onClick={()=>setEdit(true)} className='h-[40px] px-[16px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] text-[14px] font-semibold hover:bg-blue-50 transition-all'>+ Add</button>}
    </div>
    <div className='divide-y divide-gray-200'>
      {profileData.experience.map((ex, index)=>(
        <div key={index} className='px-[20px] py-[16px] hover:bg-gray-50 transition-all'>
          <h3 className='text-[16px] font-bold text-gray-900'>{ex.title}</h3>
          <p className='text-[15px] text-gray-600 mt-[4px]'>{ex.company}</p>
          <p className='text-[14px] text-gray-500 mt-[8px] leading-relaxed'>{ex.description}</p>
        </div>
      ))}
    </div>
  </div>}

        </div>




      </div>
  )
}

export default Profile
