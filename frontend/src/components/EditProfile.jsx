/*
  EditProfile.jsx
  - Modal used for editing the logged-in user's profile details.
  - Handles profile/cover image selection (client preview + upload), skills,
    education and experience lists, and sends a multipart form to the server.
  - Note: object URLs are created for previewing images; consider revoking them
    if you later convert to a persistent preview solution.
*/
import React, { useContext, useRef, useState } from 'react'
import { RxCross1 } from "react-icons/rx";
import { userDataContext } from '../context/UserContext';
import dp from "../assets/dp.webp"
import { FiPlus } from "react-icons/fi";
import { FiCamera } from "react-icons/fi";
import axios from 'axios';
import { authDataContext } from '../context/AuthContext';
function EditProfile() {
  let { edit, setEdit, userData, setUserData ,edit2,setEdit2} = useContext(userDataContext)
  let {serverUrl}=useContext(authDataContext)
  let [firstName,setFirstName]=useState(userData.firstName || "")
  let [lastName,setLastName]=useState(userData.lastName || "")
  let [userName,setUserName]=useState(userData.userName || "")
  let [headline,setHeadline]=useState(userData.headline || "")
  let [location,setLocation]=useState(userData.location || "")
  let [gender,setGender]=useState(userData.gender || "")
  let [skills,setSkills]=useState(userData.skills || [])
  let [newSkills,setNewSkills]=useState("")
  let [education,setEducation]=useState(userData.education || [])
  let [newEducation,setNewEducation]=useState({
    college:"",
    degree:"",
    fieldOfStudy:""

 })
 let [experience,setExperience]=useState(userData.experience || [])
  let [newExperience,setNewExperience]=useState( {
    title:"",
    company:"",
    description:""
})

let [frontendProfileImage,setFrontendProfileImage]=useState(userData.profileImage || dp)
let [backendProfileImage,setBackendProfileImage]=useState(null)
let [frontendCoverImage,setFrontendCoverImage]=useState(userData.coverImage || null)
let [backendCoverImage,setBackendCoverImage]=useState(null)
let [saving,setSaving]=useState(false)
const profileImage=useRef()
const coverImage=useRef()


  function addSkill(e){
e.preventDefault()
if(newSkills && !skills.includes(newSkills)){
setSkills([...skills,newSkills])
}
setNewSkills("")

  }

function removeSkill(skill){

  if(skills.includes(skill)){
    setSkills(skills.filter((s)=>s!==skill))
  }
  
}
function addEducation(e){
  e.preventDefault()
  if(newEducation.college && newEducation.degree && newEducation.fieldOfStudy ){
  setEducation([...education,newEducation])
  }
  setNewEducation({
    college:"",
    degree:"",
    fieldOfStudy:""

 })
}
 function addExperience(e){
  e.preventDefault()
  if(newExperience.title && newExperience.company && newExperience.description ){
  setExperience([...experience,newExperience])
  }
  setNewExperience({
    title:"",
    company:"",
    description:""

 })
  
    }
    function removeEducation(edu){

      if(education.includes(edu)){
        setEducation(education.filter((e)=>e!==edu))
      }
      
    }
    function removeExperience(exp){

      if(experience.includes(exp)){
        setExperience(experience.filter((e)=>e!==exp))
      }
      
    }

    // Show instant previews for selected images (object URLs)
    function handleProfileImage(e){
     let file=e.target.files[0]
     setBackendProfileImage(file)
     setFrontendProfileImage(URL.createObjectURL(file))
    }
    function handleCoverImage(e){
      let file=e.target.files[0]
      setBackendCoverImage(file)
      setFrontendCoverImage(URL.createObjectURL(file))
     }

const handleSaveProfile=async ()=>{
  setSaving(true)
  try {
    let formdata=new FormData()
    formdata.append("firstName",firstName)
    formdata.append("lastName",lastName)
    formdata.append("userName",userName)
    formdata.append("headline",headline)
    formdata.append("location",location)
    formdata.append("skills",JSON.stringify(skills))
    formdata.append("education",JSON.stringify(education))
    formdata.append("experience",JSON.stringify(experience))

    if(backendProfileImage){
      formdata.append("profileImage",backendProfileImage)
    }
    if(backendCoverImage){
      formdata.append("coverImage",backendCoverImage)
    }

    let result=await axios.put(serverUrl+"/api/v1/user/updateprofile",formdata,{withCredentials:true})
    setUserData(result.data)
    setSaving(false)
    setEdit(false)

  } catch (error) {
    console.log(error);
    setSaving(false)
  }
}

const closeModal = () => {
  setEdit(false)
}

  return (
    <div className='w-full h-[100vh] fixed top-0 left-0 z-[100] flex justify-center items-center'>

 
    <input type="file" accept='image/*' hidden ref={profileImage} onChange={handleProfileImage}/>
    <input type="file" accept='image/*' hidden ref={coverImage} onChange={handleCoverImage}/>
      <div className='w-full h-full bg-black opacity-[0.5] absolute top-0 left-0' onClick={closeModal}></div>
      <div className='w-[95%] max-w-[600px] max-h-[90vh] bg-white relative overflow-y-auto z-[200] shadow-2xl rounded-xl' >
        <div className='sticky top-0 flex justify-between items-center bg-white p-[20px] border-b border-gray-200 rounded-t-xl'>
          <h1 className='text-[22px] font-bold text-gray-900'>Edit Profile</h1>
          <button onClick={closeModal} className='p-[5px] hover:bg-gray-100 rounded-full transition-all'><RxCross1 className='w-[24px] h-[24px] text-gray-600' /></button>
        </div>



        {/* Cover Image Section */}
        <div className='relative cursor-pointer group' onClick={()=>coverImage.current.click()}>
          <div className='w-full h-[140px] bg-gradient-to-r from-blue-400 to-blue-300 overflow-hidden flex items-center justify-center relative'>
            {frontendCoverImage && <img src={frontendCoverImage} alt="" className='w-full h-full object-cover' />}
          </div>
          <div className='absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-all flex justify-center items-center'>
            <FiCamera className='w-[30px] h-[30px] text-white opacity-0 group-hover:opacity-100 transition-all' />
          </div>
        </div>

        {/* Profile Image Section */}
        <div className='px-[20px] pb-[20px]'>
          <div className='flex items-end gap-[15px] -mt-[50px] mb-[20px]'>
            <div className='relative cursor-pointer group' onClick={()=>profileImage.current.click()}>
              <div className='w-[100px] h-[100px] rounded-full border-4 border-white bg-gray-300 overflow-hidden flex items-center justify-center shadow-lg'>
                <img src={frontendProfileImage} alt="" className='w-full h-full object-cover' />
              </div>
              <div className='absolute inset-0 rounded-full bg-black opacity-0 group-hover:opacity-30 transition-all flex justify-center items-center'>
                <FiCamera className='w-[25px] h-[25px] text-white opacity-0 group-hover:opacity-100' />
              </div>
            </div>
            <p className='text-[12px] text-gray-600 pb-[10px]'>Click images to change</p>
          </div>

          {/* Basic Info Section */}
          <div className='space-y-[15px] mb-[25px]'>
            <h2 className='text-[16px] font-bold text-gray-800 mb-[10px]'>Basic Information</h2>
            
            <div className='grid grid-cols-2 gap-[15px]'>
              <div>
                <label className='block text-[13px] font-semibold text-gray-700 mb-[5px]'>First Name</label>
                <input type="text" placeholder='First Name' className='w-full px-[12px] py-[10px] text-[15px] border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300' value={firstName} onChange={(e)=>setFirstName(e.target.value)}/>
              </div>
              <div>
                <label className='block text-[13px] font-semibold text-gray-700 mb-[5px]'>Last Name</label>
                <input type="text" placeholder='Last Name' className='w-full px-[12px] py-[10px] text-[15px] border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300' value={lastName} onChange={(e)=>setLastName(e.target.value)}/>
              </div>
            </div>

            <div>
              <label className='block text-[13px] font-semibold text-gray-700 mb-[5px]'>Username</label>
              <input type="text" placeholder='Username' className='w-full px-[12px] py-[10px] text-[15px] border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300' value={userName} onChange={(e)=>setUserName(e.target.value)}/>
            </div>

            <div>
              <label className='block text-[13px] font-semibold text-gray-700 mb-[5px]'>Headline</label>
              <input type="text" placeholder='e.g., Software Developer at Tech Company' className='w-full px-[12px] py-[10px] text-[15px] border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300' value={headline} onChange={(e)=>setHeadline(e.target.value)}/>
            </div>

            <div className='grid grid-cols-2 gap-[15px]'>
              <div>
                <label className='block text-[13px] font-semibold text-gray-700 mb-[5px]'>Location</label>
                <input type="text" placeholder='City, Country' className='w-full px-[12px] py-[10px] text-[15px] border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300' value={location} onChange={(e)=>setLocation(e.target.value)}/>
              </div>
              <div>
                <label className='block text-[13px] font-semibold text-gray-700 mb-[5px]'>Gender</label>
                <input type="text" placeholder='Male/Female/Other' className='w-full px-[12px] py-[10px] text-[15px] border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300' value={gender} onChange={(e)=>setGender(e.target.value)}/>
              </div>
            </div>
          </div>

          <hr className='my-[20px]' />

          {/* Skills Section */}
          <div className='mb-[25px]'>
            <h2 className='text-[16px] font-bold text-gray-800 mb-[12px]'>Skills</h2>
            
            {skills.length > 0 && (
              <div className='mb-[12px] flex flex-wrap gap-[8px]'>
                {skills.map((skill, index) => (
                  <div key={index} className='bg-blue-100 text-blue-800 px-[12px] py-[6px] rounded-full flex items-center gap-[8px] text-[13px] font-medium'>
                    <span>{skill}</span>
                    <button onClick={() => removeSkill(skill)} className='hover:bg-blue-200 rounded-full p-[2px]'>
                      <RxCross1 className='w-[14px] h-[14px]' />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className='flex gap-[10px]'>
              <input type="text" placeholder='Add a skill (e.g., React, Python)' value={newSkills} onChange={(e)=>setNewSkills(e.target.value)} className='flex-1 px-[12px] py-[10px] text-[15px] border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-300'/>
              <button className='px-[20px] py-[10px] rounded-lg border border-blue-500 text-blue-500 hover:bg-blue-50 font-semibold transition-all text-[14px]' onClick={addSkill}>Add</button>
            </div>
          </div>

          <hr className='my-[20px]' />

          {/* Education Section */}
          <div className='mb-[25px]'>
            <h2 className='text-[16px] font-bold text-gray-800 mb-[12px]'>Education</h2>
            
            {education.length > 0 && (
              <div className='mb-[15px] space-y-[10px]'>
                {education.map((edu, index) => (
                  <div key={index} className='bg-gray-50 border border-gray-200 rounded-lg p-[12px] flex justify-between items-start gap-[10px]'>
                    <div className='flex-1'>
                      <p className='text-[14px] font-semibold text-gray-900'>{edu.college}</p>
                      <p className='text-[13px] text-gray-600'>{edu.degree}</p>
                      <p className='text-[12px] text-gray-500'>{edu.fieldOfStudy}</p>
                    </div>
                    <button onClick={() => removeEducation(edu)} className='text-red-500 hover:text-red-700 p-[5px]'>
                      <RxCross1 className='w-[18px] h-[18px]' />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className='space-y-[10px]'>
              <input type="text" placeholder='School/University' value={newEducation.college} onChange={(e)=>setNewEducation({...newEducation,college:e.target.value})} className='w-full px-[12px] py-[10px] text-[15px] border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500'/>
              <input type="text" placeholder='Degree' value={newEducation.degree} onChange={(e)=>setNewEducation({...newEducation,degree:e.target.value})} className='w-full px-[12px] py-[10px] text-[15px] border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500'/>
              <input type="text" placeholder='Field of Study' value={newEducation.fieldOfStudy} onChange={(e)=>setNewEducation({...newEducation,fieldOfStudy:e.target.value})} className='w-full px-[12px] py-[10px] text-[15px] border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500'/>
              <button className='w-full px-[20px] py-[10px] rounded-lg border border-blue-500 text-blue-500 hover:bg-blue-50 font-semibold transition-all text-[14px]' onClick={addEducation}>Add Education</button>
            </div>
          </div>

          <hr className='my-[20px]' />

          {/* Experience Section */}
          <div className='mb-[25px]'>
            <h2 className='text-[16px] font-bold text-gray-800 mb-[12px]'>Experience</h2>
            
            {experience.length > 0 && (
              <div className='mb-[15px] space-y-[10px]'>
                {experience.map((exp, index) => (
                  <div key={index} className='bg-gray-50 border border-gray-200 rounded-lg p-[12px] flex justify-between items-start gap-[10px]'>
                    <div className='flex-1'>
                      <p className='text-[14px] font-semibold text-gray-900'>{exp.title}</p>
                      <p className='text-[13px] text-gray-600'>{exp.company}</p>
                      <p className='text-[12px] text-gray-500 mt-[5px]'>{exp.description}</p>
                    </div>
                    <button onClick={() => removeExperience(exp)} className='text-red-500 hover:text-red-700 p-[5px]'>
                      <RxCross1 className='w-[18px] h-[18px]' />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className='space-y-[10px]'>
              <input type="text" placeholder='Job Title' value={newExperience.title} onChange={(e)=>setNewExperience({...newExperience,title:e.target.value})} className='w-full px-[12px] py-[10px] text-[15px] border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500'/>
              <input type="text" placeholder='Company' value={newExperience.company} onChange={(e)=>setNewExperience({...newExperience,company:e.target.value})} className='w-full px-[12px] py-[10px] text-[15px] border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500'/>
              <input type="text" placeholder='Description' value={newExperience.description} onChange={(e)=>setNewExperience({...newExperience,description:e.target.value})} className='w-full px-[12px] py-[10px] text-[15px] border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500'/>
              <button className='w-full px-[20px] py-[10px] rounded-lg border border-blue-500 text-blue-500 hover:bg-blue-50 font-semibold transition-all text-[14px]' onClick={addExperience}>Add Experience</button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex gap-[10px] mt-[30px] sticky bottom-0 bg-white pt-[20px] border-t'>
            <button className='flex-1 px-[20px] py-[12px] rounded-lg border border-gray-300 text-gray-800 hover:bg-gray-50 font-semibold transition-all text-[15px]' onClick={closeModal}>Cancel</button>
            <button className='flex-1 px-[20px] py-[12px] rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold transition-all text-[15px] disabled:opacity-50' disabled={saving} onClick={handleSaveProfile}>{saving ? "Saving..." : "Save Profile"}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditProfile
