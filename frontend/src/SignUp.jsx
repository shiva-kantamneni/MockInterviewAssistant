import React, { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import "./styles/SignUp.css"; // Make sure to create this file
import axios from 'axios';
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validations, setValidations] = useState({
    capital: false,
    number: false,
    length: false,
  });

  const [errorMsg, setErrorMsg] = useState("");
  const [usererr,setuserErr]=useState("");
  const navigate = useNavigate();

  const handlePasswordChange =(e) => {
    const value = e.target.value;
    setPassword(value);

    setValidations({
      capital: /[A-Z]/.test(value),
      number: /[0-9]/.test(value),
      length: value.length >= 8,
    });
  };
  const handleSubmit= async(e)=>{

    e.preventDefault();
    if (!email) {
    setErrorMsg("Please enter your email.");
    return;
  }
  setErrorMsg("");
  setuserErr("");
   await axios.post('http://localhost:5000/user/signup',{email,password},{
  withCredentials: true
}).then(result=>{

  navigate('/dashboard')
}
)
    .catch(err=>{
      if(err.status==400){
        setErrorMsg("User Already Exists.Please Login");
      return;
    }
    });

  }
  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2 className="subtitle">Welcome!</h2>
        <h1 className="title">Join The Community</h1>
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
          {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
        </label>

        <label className="input-label">
          <span>Password</span>
          <div className="input-group">
            <FaLock className="icon" />
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder=""
            />
            

          </div>
          {password.length > 0 && (
  <div style={{ fontSize: '14px' }}>
    {!validations.capital && (
      <p style={{ color: 'red' }}>• Must contain at least one uppercase letter</p>
    )}
    {!validations.number && (
      <p style={{ color: 'red' }}>• Must contain at least one number</p>
    )}
    {!validations.length && (
      <p style={{ color: 'red' }}>• Must be at least 8 characters long</p>
    )}
  </div>
)}
        </label>

        <button className="signup-button" disabled={!validations.capital || !validations.length || !validations.number}>Sign Up</button>
        {usererr && (
          <p style={{ color: 'red', marginTop: '8px' }}>{usererr}</p>
        )}
        </form>

        <p className="footer-text">
          Already a member?{" "}
          <a href="/" className="login-link">
            Login here →
          </a>
        </p>
      </div>
    </div>
  );
}
