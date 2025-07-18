import React, { useContext, useState, useEffect } from "react";
import dp from "../assets/dp.webp";
import moment from "moment";
import { AiOutlineLike } from "react-icons/ai";
import { FaRegCommentDots } from "react-icons/fa";
import axios from "axios";
import { authDataContext } from "../context/AuthContext.jsx";
import { socket, userDataContext } from "../context/UserContext.jsx";
import { AiFillLike } from "react-icons/ai";
import { IoSend } from "react-icons/io5";

import ConnectionButton from "./ConnectionButton.jsx";


function Post({ id, author, description, image, like, comments, createdAt }) {
  let [more, setMore] = useState(false);
  let { serverUrl } = useContext(authDataContext);
  let [liked, setLiked] = useState([]);
  let { userData, setUserData, getPost, handleGetProfile } = useContext(userDataContext);
  let [commentContent, setCommentContent] = useState("");
  let [comment, setComment] = useState([]);
  let[showComment, setShowComment]= useState(false)

  
  const handleLike = async () => {
    try {
      let result = await axios.get(serverUrl + `/api/post/like/${id}`, {
        withCredentials: true,
      });
      setLiked(result.data.post.like);
    } catch (err) {
      console.log(err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      let result = await axios.post(
        serverUrl + `/api/post/comments/${id}`,
        { content: commentContent },
        { withCredentials: true }
      );
      setComment(result.data.post.comments);
      setCommentContent(""); // ✅ clear input after comment
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(()=>{
    socket.on("likeUpdated", ({postId,likes})=>{
       if(postId==id){
        setLiked(likes)
       }
    })

    socket.on("commentAdded", ({postId,comm})=>{
       if(postId==id){
        setComment(comm)
       }
    })

    return ()=>{
      socket.off("likeUpdated")
      socket.off("commentAdded")
    }
  },[id])

  useEffect(()=>{
    setLiked(like)
    setComment(comments || [])
  },[like,comments])

  
  return (
    <div className="w-full min-h-[200px] bg-white rounded-lg shadow-lg px-[20px] py-[10px] flex flex-col gap-[10px]">
      <div className="flex justify-between items-start">
      
        <div className="flex justify-center items-start gap-[10px] " onClick={() => {
  if (!author?.userName) {
    console.error("author.userName is undefined", author);
    return;
  }
  handleGetProfile(author.userName);
}}
 >
          <div className="w-[70px] h-[70px] rounded-full overflow-hidden flex items-center justify-center cursor-pointer">
            <img src={author?.profileImage || dp} alt="" className="h-full" />
          </div>
          <div className="py-[10px]">
            <div className="text-[20px] font-semibold">{`${author?.firstName} ${author?.lastName}`}</div>
            <div className="text-[16px]">{author?.headline}</div>
            <div className="text-[15px]">{moment(createdAt).fromNow()}</div>
          </div>
        </div>
        <div>
          {userData._id!=author._id && <ConnectionButton userId={author._id} /> }
          
        </div>
      </div>

      <div
        className={`w-full ${
          !more ? "max-h-[100px] overflow-hidden" : ""
        } pl-[50px]`}
      >
        {description}
      </div>
      <div
        className="pl-[50px] text-[15px] font-semibold cursor-pointer"
        onClick={() => setMore((prev) => !prev)}
      >
        {more ? "read less..." : "read more..."}
      </div>

      {image && (
        <div className="w-full h-[300px] overflow-hidden flex justify-center items-center rounded-lg">
          <img src={image} alt="" className="h-full rounded-lg" />
        </div>
      )}

      <div>
        <div className="w-full flex justify-between items-center p-[20px] border-b border-gray-500">
          <div className="flex items-center justify-center gap-[5px] text-[18px]">
            <AiOutlineLike className="text-[#1ebBff] w-[20px] h-[20px]" />
            <span>{liked?.length || 0}</span>
          </div>
          <div className="flex items-center justify-center gap-[5px] text-[18px] cursor-pointer" onClick={()=>setShowComment(prev=>!prev)}>
            <span>{comments?.length || 0}</span>
            <span>comments</span>
          </div>
        </div>

        <div className="flex justify-start items-center p-[20px] w-full gap-[20px]">
          {!liked.includes(userData._id) && (
            <div
              className="flex justify-center items-center gap-[5px] cursor-pointer"
              onClick={handleLike}
            >
              <AiOutlineLike className="w-[24px] h-[24px]" />
              <span>Like</span>
            </div>
          )}
          {liked.includes(userData._id) && (
            <div
              className="flex justify-center items-center gap-[5px] cursor-pointer"
              onClick={handleLike}
            >
              <AiFillLike className="w-[24px] h-[24px] text-[#07a4ff]" />
              <span className="text-[#07a4ff] font-semibold">Liked</span>
            </div>
          )}

          <div className="flex items-center justify-center gap-[5px] cursor-pointer" onClick={()=> setShowComment(prev=>!prev)}>
            <FaRegCommentDots />
            <span >comment</span>
          </div>
        </div>
    {showComment &&  <div>
          <form
            className="w-full h-[50px] flex items-center justify-start gap-[10px] px-[20px] border-b border-gray-500"
            onSubmit={handleComment}
          >
            <input
              type="text"
              placeholder={"leave a comment"}
              className="outline-none border-none"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
            />
            <button>
              <IoSend className="text-[#07a4ff] w-[22px] h-[22px]" />
            </button>
          </form>

          <div className="flex flex-col gap-[10px]">
            {comment.map((com) => (
              <div
                key={com._id}
                className=" flex flex-col gap-[20px]  p-[20px] border-b-2 border-b-gray-300"
              >
                <div className="w-full flex justify-start items-center gap-[10px]">
                  <div className="w-[40px] h-[40px] rounded-full overflow-hidden flex items-center justify-center cursor-pointer">
                    <img
                      src={com.user?.profileImage || dp}
                      alt=""
                      className="h-full"
                    />
                  </div>
                  <div>
                  <div className="text-[16px] font-semibold">{`${com.user?.firstName} ${com.user?.lastName}`}</div>
                  <div>{moment(com.createdAt).fromNow()}</div>
                  
                </div>
                </div>
                <div className="pl-[50px]">{com.content}</div>
               
              </div>
            ))}
          </div>
        </div>}
        
      </div>
    </div>
  );
}

export default Post;
