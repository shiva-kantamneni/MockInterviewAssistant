import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaGoogle } from "react-icons/fa";
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:wght@700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #05080f;
    --card: #0c1120;
    --card-border: rgba(255,255,255,0.07);
    --surface: #111827;
    --surface2: #0f1623;
    --accent: #4f8ef7;
    --accent2: #a78bfa;
    --accent3: #34d399;
    --danger: #f87171;
    --text: #e2e8f8;
    --muted: #5a6480;
    --radius: 20px;
  }

  .si-root {
    min-height: 100vh;
    background: var(--bg);
    font-family: 'Outfit', sans-serif;
    color: var(--text);
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px 20px;
  }

  /* Ambient */
  .si-root::before {
    content: '';
    position: fixed; inset: 0;
    background:
      radial-gradient(ellipse 70% 60% at 10% 5%,  rgba(79,142,247,0.12) 0%, transparent 60%),
      radial-gradient(ellipse 55% 50% at 90% 95%, rgba(167,139,250,0.11) 0%, transparent 55%),
      radial-gradient(ellipse 35% 35% at 50% 50%, rgba(52,211,153,0.04) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }

  .grid-bg {
    position: fixed; inset: 0;
    background-image: radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px);
    background-size: 38px 38px;
    pointer-events: none; z-index: 0;
  }

  .orb {
    position: fixed; border-radius: 50%;
    filter: blur(90px); opacity: 0.14;
    animation: drift 22s ease-in-out infinite alternate;
    pointer-events: none; z-index: 0;
  }
  .orb-a { width: 420px; height: 420px; background: #4f8ef7; top: -160px; left: -100px; }
  .orb-b { width: 340px; height: 340px; background: #a78bfa; bottom: -110px; right: -70px; animation-duration: 28s; animation-delay: -12s; }
  .orb-c { width: 200px; height: 200px; background: #34d399; top: 40%; right: 8%; opacity: 0.07; animation-duration: 18s; animation-delay: -5s; }

  @keyframes drift {
    from { transform: translate(0,0) scale(1); }
    to   { transform: translate(28px,38px) scale(1.07); }
  }

  /* Page wrapper */
  .si-page {
    position: relative; z-index: 1;
    width: 100%; max-width: 440px;
    animation: fadeUp 0.45s ease both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Brand */
  .brand-bar {
    display: flex; align-items: center; justify-content: center;
    gap: 10px; margin-bottom: 32px;
  }
  .brand-gem {
    width: 34px; height: 34px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
    box-shadow: 0 0 20px rgba(79,142,247,0.5);
  }
  .brand-name {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    background: linear-gradient(90deg, var(--accent), var(--accent2));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }

  /* Card */
  .si-card {
    background: var(--card);
    border: 1px solid var(--card-border);
    border-radius: var(--radius);
    overflow: hidden;
    position: relative;
  }

  .si-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--accent), var(--accent2), transparent);
  }

  /* Hero area */
  .si-hero {
    padding: 34px 32px 26px;
    text-align: center;
    border-bottom: 1px solid var(--card-border);
    position: relative;
    overflow: hidden;
  }

  .si-hero::after {
    content: '';
    position: absolute; right: -50px; top: -50px;
    width: 200px; height: 200px;
    background: radial-gradient(circle, rgba(79,142,247,0.07) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }

  .si-avatar {
    width: 64px; height: 64px;
    background: linear-gradient(135deg, var(--surface2), var(--surface));
    border-radius: 50%;
    margin: 0 auto 16px;
    border: 2px solid transparent;
    background: linear-gradient(var(--card), var(--card)) padding-box,
                linear-gradient(135deg, var(--accent), var(--accent2)) border-box;
    display: flex; align-items: center; justify-content: center;
    font-size: 24px;
    box-shadow: 0 0 22px rgba(79,142,247,0.25);
    position: relative; z-index: 1;
  }

  .si-title {
    font-family: 'Playfair Display', serif;
    font-size: 24px; font-weight: 700;
    margin-bottom: 6px;
    position: relative; z-index: 1;
  }

  .si-sub {
    font-size: 13.5px; color: var(--muted);
    position: relative; z-index: 1;
  }

  /* Form body */
  .si-form-body {
    padding: 26px 32px 30px;
    display: flex; flex-direction: column; gap: 16px;
  }

  .field-group { display: flex; flex-direction: column; gap: 7px; }

  .field-label {
    font-size: 11.5px; font-weight: 600;
    letter-spacing: 0.09em; text-transform: uppercase;
    color: var(--muted);
  }

  .field-wrap {
    position: relative;
    display: flex; align-items: center;
  }

  .field-icon {
    position: absolute; left: 14px;
    color: var(--muted); font-size: 13px;
    pointer-events: none;
    transition: color 0.2s;
  }

  .field-input {
    width: 100%;
    background: var(--surface2);
    border: 1px solid var(--card-border);
    border-radius: 11px;
    padding: 12px 14px 12px 40px;
    color: var(--text);
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }

  .field-input::placeholder { color: var(--muted); }

  .field-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(79,142,247,0.13);
    background: rgba(79,142,247,0.04);
  }

  .field-input:focus ~ .field-icon,
  .field-wrap:focus-within .field-icon {
    color: var(--accent);
  }

  .field-row {
    display: flex; align-items: center;
    justify-content: space-between;
    margin-top: -4px;
  }

  .forgot-link {
    font-size: 12px; color: var(--accent);
    text-decoration: none; font-weight: 500;
    transition: color 0.15s;
  }
  .forgot-link:hover { color: var(--accent2); }

  /* Error */
  .error-msg {
    font-size: 12px; color: var(--danger);
    display: flex; align-items: center; gap: 5px;
    margin-top: -8px;
  }

  /* Submit */
  .submit-btn {
    width: 100%; padding: 13px;
    border-radius: 50px; border: none;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    color: white;
    font-family: 'Outfit', sans-serif;
    font-size: 14.5px; font-weight: 700;
    cursor: pointer; letter-spacing: 0.03em;
    transition: transform 0.18s, box-shadow 0.18s, opacity 0.18s;
    box-shadow: 0 4px 22px rgba(79,142,247,0.38);
    display: flex; align-items: center; justify-content: center; gap: 8px;
    margin-top: 4px;
  }
  .submit-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(79,142,247,0.52); }
  .submit-btn:active { transform: translateY(0); opacity: 0.88; }

  /* Divider */
  .divider {
    display: flex; align-items: center; gap: 12px;
    color: var(--muted); font-size: 12px;
  }
  .divider::before, .divider::after {
    content: ''; flex: 1; height: 1px;
    background: var(--card-border);
  }

  /* Google */
  .google-btn {
    width: 100%; padding: 12px;
    border-radius: 50px;
    border: 1px solid var(--card-border);
    background: var(--surface2);
    color: var(--text);
    font-family: 'Outfit', sans-serif;
    font-size: 14px; font-weight: 500;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    transition: border-color 0.18s, background 0.18s, transform 0.18s;
  }

  .google-btn:hover {
    border-color: rgba(79,142,247,0.4);
    background: rgba(79,142,247,0.05);
    transform: translateY(-1px);
  }

  .google-icon {
    width: 18px; height: 18px;
    background: linear-gradient(135deg, #ea4335, #fbbc05, #34a853, #4285f4);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 10px; color: white;
    flex-shrink: 0;
  }

  /* Footer */
  .si-footer {
    padding: 0 32px 26px;
    text-align: center;
    font-size: 13px; color: var(--muted);
  }

  .si-footer a {
    color: var(--accent); font-weight: 600;
    text-decoration: none; transition: color 0.15s;
  }
  .si-footer a:hover { color: var(--accent2); }

  /* API error banner */
  .api-error {
    background: rgba(248,113,113,0.08);
    border: 1px solid rgba(248,113,113,0.25);
    border-radius: 10px;
    padding: 10px 14px;
    font-size: 13px; color: var(--danger);
    display: flex; align-items: center; gap: 8px;
  }
`;

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError(''); setPasswordError(''); setApiError('');

    let valid = true;
    if (!email) { setEmailError('Please enter your email.'); valid = false; }
    if (!password) { setPasswordError('Please enter your password.'); valid = false; }
    if (!valid) return;

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/user/signin', { email, password }, { withCredentials: true });
      const token = response.data.token;
       localStorage.setItem("token", token);
      navigate('/dashboard');
    } catch (err) {
      setApiError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="si-root">
        <div className="grid-bg" />
        <div className="orb orb-a" />
        <div className="orb orb-b" />
        <div className="orb orb-c" />

        <div className="si-page">
          {/* Brand */}
          <div className="brand-bar">
            <div className="brand-gem"></div>
            <span className="brand-name">InterviewAI</span>
          </div>

          <div className="si-card">
            {/* Hero */}
            <div className="si-hero">
              <div className="si-avatar">👤</div>
              <div className="si-title">Welcome Back</div>
              <div className="si-sub">Sign in to continue your interview journey</div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="si-form-body">
              {apiError && (
                <div className="api-error">⚠️ {apiError}</div>
              )}

              {/* Email */}
              <div className="field-group">
                <label className="field-label">E-Mail Address</label>
                <div className="field-wrap">
                  <FaEnvelope className="field-icon" />
                  <input
                    className="field-input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>
                {emailError && <div className="error-msg">⚠ {emailError}</div>}
              </div>

              {/* Password */}
              <div className="field-group">
                <div className="field-row">
                  <label className="field-label">Password</label>
                  <a href="/forgot-password" className="forgot-link">Forgot password?</a>
                </div>
                <div className="field-wrap">
                  <FaLock className="field-icon" />
                  <input
                    className="field-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                {passwordError && <div className="error-msg">⚠ {passwordError}</div>}
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Signing in…' : 'Continue →'}
              </button>

              <div className="divider">or</div>

              <button type="button" className="google-btn">
                <span className="google-icon">G</span>
                Continue with Google
              </button>
            </form>

            {/* Footer */}
            <div className="si-footer">
              Don't have an account?{" "}
              <a href="/register">Sign up</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}