import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";
import axios from 'axios'
import './styles/SignIn.css'

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password,setPassword]=useState("");
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [apiError, setApiError] = useState('');

  const navigate = useNavigate();
  const handleSubmit= async(e)=>{
    e.preventDefault();
//     if(!email && !password){
//       setEmailError('Enter Email');
//       setPasswordError("Enter password");
//       return;
//     }
//     if(!email){
//       setEmailError('Enter Email to continue');
//       return;
//     }
//     if(!email){
//       setPasswordError('Enter Password for the validation');
//       return;
//     }
//     const response = await axios.post('http://localhost:5000/user/signin',{email,password},{
//   withCredentials: true
// });
//     if(response.status==401){
//       alert("user not exists");
//       return;
//     }
//     if(response.status==201){
     
//     }

     navigate('/dashboard');


  }
  return (
    <div className="signin-container">
      <div className="signin-box">
        <h1 className="title" style={{ textAlign: "center", marginBottom: "10px" }}>
          InterviewAssistant
        </h1>

        <h2 className="subtitle" style={{ textAlign: "center", marginBottom: "20px" }}>
          Welcome Back
        </h2>
        <form onSubmit={handleSubmit}>
        <label className="input-label">
          <span>E-Mail</span>
          <div className="input-group">
            <FaEnvelope className="icon" />
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=""
            />
          </div>
        </label>
        <label className="input-label">
          <span>Password</span>
          <div className="input-group">
            <FaLock className="icon" />
            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=""
            />
          </div>
        </label>

        <button className="signin-button" style={{ marginTop: "20px" }}>
          Continue
        </button>
        
        </form>

        <p className="footer-text" style={{ marginTop: "15px" }}>
          Don’t have an account?{" "}
          <a href="/register" className="signup-link">
            Sign up
          </a>
        </p>

        <div style={{ margin: "15px 0", textAlign: "center", color: "#aaa" }}>----------or----------</div>

        <button
          className="google-button"
          
        >
            <FaGoogle style={{ fontSize: "14px" }} />
          Continue With Google
        </button>
      </div>
    </div>
  );
}
