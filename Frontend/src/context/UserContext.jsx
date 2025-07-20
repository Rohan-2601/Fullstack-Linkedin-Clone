import React, { createContext, useContext, useEffect, useState } from "react";
import { authDataContext } from "./AuthContext.jsx";
import axios from "axios";
import {  useNavigate } from 'react-router-dom';
import {io} from "socket.io-client"

 export const socket=io("https://backend-linkedin-clone.onrender.com")

export const userDataContext = createContext();

function UserContext({ children }) {
  const [userData, setUserData] = useState(null);
  const { serverUrl } = useContext(authDataContext);
  let [edit, setEdit] = useState(false);
  let [postData, setPostData] = useState([]);
  let [profileData, setProfileData]= useState([])
  let navigate= useNavigate()

  const getCurrentUser = async () => {
    try {
      const result = await axios.get(serverUrl + "/api/user/currentuser", {
        withCredentials: true,
      });

      console.log("Current user data:", result.data);
      setUserData(result.data.user); // assuming the response has a `user` field
    } catch (err) {
      console.log("Error fetching current user:", err);
        setUserData(null); // reset user data on error
      }
    }
  const getPost= async () => {
    try {
      let result = await axios.get(serverUrl + "/api/post/getpost", {
        withCredentials: true,
      });
      console.log("Posts fetched:", result.data);
      setPostData(result.data); // assuming the response has a `posts` field
    } catch (err) {
      console.log("Error fetching posts:", err);
    }
  };
   const handleGetProfile= async (userName)=>{
      try{
        let result = await axios.get(serverUrl + `/api/user/profile/${userName}`, {
        withCredentials: true,
      });
      setProfileData(result.data)
      navigate("/profile")

      }
      catch(err) {
          console.log(err) 
      }
   }

  useEffect(() => {
    getCurrentUser();
    getPost();
  }, []);
  const value = { userData, setUserData,edit, setEdit , postData, setPostData, getPost, handleGetProfile, profileData, setProfileData};
  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
}

export default UserContext;
