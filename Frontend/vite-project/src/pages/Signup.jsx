import React, { useState, useContext } from 'react';
import logo from '../assets/logo.svg';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { authDataContext } from '../context/AuthContext.jsx'; 
import { userDataContext } from '../context/UserContext.jsx';

function Signup() {
  const [show, setShow] = useState(false);
  const { serverUrl } = useContext(authDataContext);
  const { userData, setUserData } = useContext(userDataContext); // ✅ fixed
  const navigate = useNavigate();

  let [firstName, setFirstName] = useState("");
  let [lastName, setLastName] = useState("");  
  let [userName, setUserName] = useState("");
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [loading, setLoading] = useState(false);  

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let result = await axios.post(serverUrl + "/api/auth/signup", { 
        firstName,
        lastName,
        userName,
        email,
        password
      }, { withCredentials: true });
      console.log("Signup successful:", result.data);
     setUserData(result.data.user); // assuming the response has a `user` field
      
      navigate("/");

      setLoading(false);
       setFirstName("");
       setLastName(""); 
        setUserName("");
        setEmail("");

        setPassword("");

    }
    catch (err) {
  console.error("Error during signup:", err);
  setLoading(false);
  if (err.response) {
    console.log("Server responded with:", err.response.data);
    alert(err.response.data.message); // show actual error
  } else {
    alert("Unknown error. Check console.");
  }
}
  }

  return (
    <div className='w-full h-screen bg-[white] flex flex-col items-center justify-start gap-[10px]'>
      <div className='p-[30px] lg:p-[35px] w-full h-[80px] flex items-center'>
        <img src={logo} alt="" />
      </div>

      <form className='w-[90%] max-w-[400px] h-[600px] md:shadow-xl flex flex-col justify-center gap-[10px] p-[15px]' onSubmit={handleSignUp}>
        <h1 className='text-gray-800 text-[30px] font-semibold mb-[30px]'>Sign Up</h1>

        <input type='text' placeholder='firstName' required className='w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md' value={firstName} onChange={(e) => setFirstName(e.target.value)} />

        <input type='text' placeholder='lastName' required className='w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md ' value={lastName} onChange={(e) => setLastName(e.target.value)} />

        <input type='text' placeholder='userName' required className='w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md' value={userName} onChange={(e) => setUserName(e.target.value)} />

        <input type='email' placeholder='email' required className='w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md' value={email} onChange={(e) => setEmail(e.target.value)} />

        <div className='w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] rounded-md relative'>
          <input type={show ? "text" : "password"} placeholder='password' required className='w-full h-full border-none text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md' value={password} onChange={(e) => setPassword(e.target.value)} />

          <span className='absolute right-[20px] top-[10px] text-[#24b2ff] cursor-pointer font-semibold' onClick={() => setShow(prev => !prev)}>{show ? "hidden" : "show"}</span>
        </div>

        <button className='w-[100%] h-[40px] rounded-full bg-[#24b2ff] mt-[30px] text-white' disabled={loading}>{loading?"Loading...":"Sign Up"}</button>
        <p className='text-center'>Already have an account? <span className='text-[#2a9bd8] cursor-pointer ' onClick={() => navigate("/Login")}>Sign In</span></p>
      </form>
    </div>
  );
}

export default Signup;
