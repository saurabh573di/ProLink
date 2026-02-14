import React, { useContext, useEffect, useState, memo, useCallback } from 'react'
import dp from "../assets/dp.webp"
import moment from "moment"
import { FaRegCommentDots } from "react-icons/fa";
import { BiLike } from "react-icons/bi";
import axios from 'axios';
import { authDataContext } from '../context/AuthContext';
import { userDataContext } from '../context/UserContext';
import { BiSolidLike } from "react-icons/bi";
import { LuSendHorizontal } from "react-icons/lu";
import ConnectionButton from './ConnectionButton';

function Post({ id, author, like, comment, description, image,createdAt }) {
    
    let [more,setMore]=useState(false)
  let {serverUrl}=useContext(authDataContext)
  let {userData,setUserData,getPost,handleGetProfile,socket}=useContext(userDataContext)
  let [likes,setLikes]=useState(like)
  let [commentContent,setCommentContent]=useState("")
  let [comments,setComments]=useState(comment)
  let [showComment,setShowComment]=useState(false)

  // PERFORMANCE: useCallback prevents function recreation on every render
  // This prevents unnecessary re-renders of child components
  const handleLike=useCallback(async ()=>{
    try {
      let result=await axios.get(serverUrl+`/api/post/like/${id}`,{withCredentials:true})
     setLikes(result.data.like)
    } catch (error) {
      console.log(error)
    }
  }, [serverUrl, id])
  
  const handleComment=useCallback(async (e)=>{
     e.preventDefault()
      try {
        let result=await axios.post(serverUrl+`/api/post/comment/${id}`,{
          content:commentContent
        },{withCredentials:true})
        setComments(result.data.comment)
      setCommentContent("")
      } catch (error) {
        console.log(error)
      }
    }, [serverUrl, id, commentContent])

      useEffect(()=>{
        // PERFORMANCE: Socket listeners for real-time updates
        // Properly cleanup event listeners to prevent memory leaks
        if(!socket) return;
        socket.on("likeUpdated",({postId,likes})=>{
          if(postId==id){
            setLikes(likes)
          }
        })
        socket.on("commentAdded",({postId,comm})=>{
          if(postId==id){
            setComments(comm)
          }
        })

        return ()=>{
          // IMPORTANT: Clean up event listeners to prevent duplicate listeners on re-renders
if(socket){
socket.off("likeUpdated")
socket.off("commentAdded")
}
        }
      },[id,socket])

   useEffect(()=>{
    getPost()
    
    },[likes,comments])


    return (
        <div className="w-full min-h-[200px] flex flex-col gap-[10px] bg-white rounded-lg shadow-lg  p-[20px] ">

          <div className='flex justify-between items-center'>

            <div className='flex justify-center items-start gap-[10px]' onClick={()=>handleGetProfile(author.userName)}>
                <div className='w-[70px] h-[70px] rounded-full overflow-hidden flex items-center justify-center  cursor-pointer' >
                    <img src={author.profileImage || dp} alt="" className='h-full' loading="lazy" onError={(e) => e.target.src = dp}/>
                </div>
                <div>
                <div className='text-[22px] font-semibold'>{`${author.firstName} ${author.lastName}` }</div>
                <div className='text-[16px]'>{author.headline}</div>
                <div className='text-[16px]'>{moment(createdAt).fromNow()}</div>
                </div>
            </div>
            <div>

              {userData._id!=author._id &&  <ConnectionButton userId={author._id}/>}
           
              
            </div>
            </div>
         <div className={`w-full ${!more?"max-h-[100px] overflow-hidden":""} pl-[50px]`}>{description}</div>
         <div className="pl-[50px] text-[19px] font-semibold cursor-pointer" onClick={()=>setMore(prev=>!prev)}>{more?"read less...":"read more..."}</div>

         {image && 
         <div className='w-full h-[300px] overflow-hidden flex justify-center rounded-lg'>
<img src={image} alt="" className='h-full rounded-lg' loading="lazy" onError={(e) => e.target.style.display = 'none'}/>
</div>}

<div>
<div className='w-full flex justify-between items-center p-[20px] border-b-2 border-gray-500'>
<div className='flex items-center justify-center gap-[5px] text-[18px]'>
    <BiLike className='text-[#1ebbff] w-[20px] h-[20px]'/><span >{likes.length}</span></div>
<div className='flex items-center justify-center gap-[5px] text-[18px] cursor-pointer' onClick={()=>setShowComment(prev=>!prev)}><span>{comment.length}</span><span>comments</span></div>
</div>
<div className='flex justify-start items-center w-full p-[20px] gap-[20px]'>
{!likes.some(id => id.toString() === userData._id.toString()) &&  <div className='flex justify-center items-center gap-[5px] cursor-pointer' onClick={handleLike}>
<BiLike className=' w-[24px] h-[24px]'/>
<span>Like</span>
</div>}
{likes.some(id => id.toString() === userData._id.toString()) &&  <div className='flex justify-center items-center gap-[5px] cursor-pointer' onClick={handleLike}>
<BiSolidLike className=' w-[24px] h-[24px] text-[#07a4ff]'/>
<span className="text-[#07a4ff] font-semibold">Liked</span>
</div>}

<div className='flex justify-center items-center gap-[5px] cursor-pointer' onClick={()=>setShowComment(prev=>!prev)}>
<FaRegCommentDots className=' w-[24px] h-[24px]'/>
<span>comment</span>
</div>
</div>

{showComment && <div>
    <form className="w-full flex justify-between items-center border-b-2 border-b-gray-300 p-[10px] 
    " onSubmit={handleComment}>
    <input type="text" placeholder={"leave a comment"} className='outline-none  border-none' value={commentContent} onChange={(e)=>setCommentContent(e.target.value)}/>
    <button><LuSendHorizontal className="text-[#07a4ff] w-[22px] h-[22px]"/></button>
    </form>

    <div className='flex flex-col gap-[10px]'>
       {comments.map((com)=>(
        <div key={com._id} className='flex flex-col gap-[10px] border-b-2 p-[20px] border-b-gray-300' >
            <div className="w-full flex justify-start items-center gap-[10px]">
            <div className='w-[40px] h-[40px] rounded-full overflow-hidden flex items-center justify-center  cursor-pointer' >
                    <img src={com.user.profileImage || dp} alt="" className='h-full' />
                </div> 
                
                <div className='text-[16px] font-semibold'>{`${com.user.firstName} ${com.user.lastName}` }</div>
              
                
            </div>
            <div className='pl-[50px]'>{com.content}</div>
        </div>
       ))} 
    </div>
</div>}

</div>
         
        </div>
    )
}

export default memo(Post)
