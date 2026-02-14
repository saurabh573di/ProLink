/*
  Post.jsx
  - Renders a single post including: author info, description, image, likes and comments.
  - Implements optimistic UI updates for likes and listens to socket events to update
    likes/comments in real-time.
  - Important: optimistic updates are reverted on API errors to keep state consistent.
*/
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
    const isAlreadyLiked = likes.some(id => id.toString() === userData._id.toString());
    
    // 🔥 OPTIMISTIC UPDATE: Update UI instantly
    if (isAlreadyLiked) {
      setLikes(prev => prev.filter(id => id.toString() !== userData._id.toString()));
    } else {
      setLikes(prev => [...prev, userData._id]);
    }

    // 🚀 Call API in background (don't wait for response)
    try {
      await axios.get(serverUrl+`/api/post/like/${id}`,{withCredentials:true})
    } catch (error) {
      // 🔄 Revert optimistic update on error
      if (isAlreadyLiked) {
        setLikes(prev => [...prev, userData._id]);
      } else {
        setLikes(prev => prev.filter(id => id.toString() !== userData._id.toString()));
      }
      console.log(error)
    }
  }, [serverUrl, id, userData._id, likes])
  
  const handleComment=useCallback(async (e)=>{
     e.preventDefault()
      try {
        let result=await axios.post(serverUrl+`/api/post/comment/${id}`,{
          content:commentContent
        },{withCredentials:true})
        // IMPORTANT: Ensure comments is always an array
        setComments(Array.isArray(result.data.comment) ? result.data.comment : result.data?.comment || [])
      setCommentContent("")
      } catch (error) {
        console.log(error)
        // CRITICAL: Reset to empty array on error
        setComments([])
      }
    }, [serverUrl, id, commentContent])

      useEffect(()=>{
        // PERFORMANCE: Socket listeners for real-time updates
        // Properly cleanup event listeners to prevent memory leaks
        if(!socket) return;
        socket.on("likeUpdated",({postId,likes})=>{
          if(postId === id){
            setLikes(likes)
          }
        })
        socket.on("commentAdded",({postId,comm})=>{
          if(postId === id){
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
        <div className="w-full min-h-[200px] flex flex-col gap-[15px] bg-white rounded-xl shadow-lg hover:shadow-xl p-[15px] md:p-[20px] transition-shadow">

          <div className='flex justify-between items-center gap-[10px]'>

            <div className='flex justify-center items-start gap-[10px] cursor-pointer flex-1 min-w-0' onClick={()=>handleGetProfile(author.userName)}>
                {/* RESPONSIVE: Profile image scales for mobile/tablet/desktop */}
                <div className='w-[50px] h-[50px] md:w-[70px] md:h-[70px] rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center'>
                    <img src={author.profileImage || dp} alt="" className='h-full' loading="lazy" onError={(e) => e.target.src = dp}/>
                </div>
                {/* Name/headline/time info - responsive text sizes */}
                <div className='min-w-0 flex-1'>
                  <div className='text-[16px] md:text-[22px] font-semibold truncate'>{`${author.firstName} ${author.lastName}` }</div>
                  <div className='text-[13px] md:text-[16px] text-gray-600 line-clamp-1'>{author.headline}</div>
                  <div className='text-[13px] md:text-[16px] text-gray-500'>{moment(createdAt).fromNow()}</div>
                </div>
            </div>
            <div className='flex-shrink-0'>
              {userData._id!=author._id &&  <ConnectionButton userId={author._id}/>}
            </div>
            </div>

          {/* Description with responsive padding and font size */}
         <div className={`w-full px-[12px] md:px-0 text-[14px] md:text-[16px] ${!more ? "max-h-[80px] md:max-h-[100px] overflow-hidden" : ""} whitespace-pre-line break-words md:break-normal`} style={{wordBreak:'break-word'}}>
           {description}
         </div>
         {/* Read more/less button - responsive positioning */}
         <div
           className="px-[12px] md:px-0 text-[14px] md:text-[19px] font-semibold cursor-pointer text-[#2dc0ff] hover:text-[#07a4ff] transition-colors w-fit md:w-auto mt-1 md:mt-0"
           onClick={() => setMore(prev => !prev)}
         >
           {more ? "read less..." : "read more..."}
         </div>

         {/* Responsive image container */}
         {image && 
         <div className='w-full bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center'>
<img src={image} alt="" className='w-full max-h-[400px] md:max-h-[500px] object-contain rounded-lg' loading="lazy" onError={(e) => e.target.style.display = 'none'}/>
</div>}

<div>
{/* Likes and comments count - responsive layout */}
<div className='w-full flex flex-wrap justify-between items-center p-[12px] md:p-[20px] border-b-2 border-gray-500 gap-[10px]'>
  <div className='flex items-center justify-center gap-[5px] text-[14px] md:text-[18px]'>
    <BiLike className='text-[#1ebbff] w-[18px] h-[18px] md:w-[20px] md:h-[20px]'/><span>{likes.length}</span>
  </div>
  <div className='flex items-center justify-center gap-[5px] text-[14px] md:text-[18px] cursor-pointer hover:text-[#2dc0ff] transition-colors' onClick={()=>setShowComment(prev=>!prev)}>
    <span>{comment.length}</span><span>comments</span>
  </div>
</div>

{/* Action buttons - responsive with wrapping for mobile */}
<div className='flex flex-wrap justify-start items-center w-full p-[12px] md:p-[20px] gap-[15px] md:gap-[20px]'>
  {!likes.some(id => id.toString() === userData._id.toString()) &&  
    <div className='flex justify-center items-center gap-[5px] cursor-pointer hover:text-[#2dc0ff] hover:bg-gray-100 px-[8px] py-[6px] rounded-lg transition-colors text-[14px] md:text-[16px]' onClick={handleLike}>
      <BiLike className='w-[20px] h-[20px] md:w-[24px] md:h-[24px]'/>
      <span>Like</span>
    </div>
  }
  {likes.some(id => id.toString() === userData._id.toString()) &&  
    <div className='flex justify-center items-center gap-[5px] cursor-pointer px-[8px] py-[6px] rounded-lg text-[14px] md:text-[16px] hover:bg-blue-50 transition-colors' onClick={handleLike}>
      <BiSolidLike className='w-[20px] h-[20px] md:w-[24px] md:h-[24px] text-[#07a4ff]'/>
      <span className="text-[#07a4ff] font-semibold">Liked</span>
    </div>
  }

  <div className='flex justify-center items-center gap-[5px] cursor-pointer hover:text-[#2dc0ff] hover:bg-gray-100 px-[8px] py-[6px] rounded-lg transition-colors text-[14px] md:text-[16px]' onClick={()=>setShowComment(prev=>!prev)}>
    <FaRegCommentDots className='w-[20px] h-[20px] md:w-[24px] md:h-[24px]'/>
    <span>Comment</span>
  </div>
</div>

{showComment && <div className='w-full'>
    {/* Comment input form - responsive */}
    <form className="w-full flex justify-between items-center border-b-2 border-b-gray-300 p-[10px] md:p-[15px] gap-[10px]" onSubmit={handleComment}>
      <input 
        type="text" 
        placeholder={"leave a comment"} 
        className='outline-none border-none flex-1 text-[14px] md:text-[16px] min-w-0' 
        value={commentContent} 
        onChange={(e)=>setCommentContent(e.target.value)}
      />
      <button className='flex-shrink-0'>
        <LuSendHorizontal className="text-[#07a4ff] w-[20px] h-[20px] md:w-[22px] md:h-[22px]"/>
      </button>
    </form>

    {/* Comments list - responsive */}
    <div className='flex flex-col gap-[10px] max-h-[400px] overflow-y-auto'>
       {comments.map((com)=>(
        <div key={com._id} className='flex flex-col gap-[8px] border-b-2 p-[12px] md:p-[20px] border-b-gray-300'>
            {/* Commenter info - responsive layout */}
            <div className="w-full flex justify-start items-center gap-[8px] md:gap-[10px]">
              <div className='w-[35px] h-[35px] md:w-[40px] md:h-[40px] rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center'>
                <img src={com.user.profileImage || dp} alt="" className='w-full h-full object-cover' />
              </div> 
              <div className='font-semibold text-[14px] md:text-[16px] truncate'>
                {`${com.user.firstName} ${com.user.lastName}`}
              </div>
            </div>
            {/* Comment content - responsive text size and wrapping */}
            <div className='text-[13px] md:text-[15px] break-words'>{com.content}</div>
        </div>
       ))} 
    </div>
</div>}

</div>
         
        </div>
    )
}

export default memo(Post)
