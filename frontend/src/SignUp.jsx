import React, { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

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
    --gold: #f59e0b;
    --text: #e2e8f8;
    --muted: #5a6480;
    --radius: 20px;
  }

  .su-root {
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

  .su-root::before {
    content: '';
    position: fixed; inset: 0;
    background:
      radial-gradient(ellipse 70% 60% at 10% 5%,  rgba(167,139,250,0.11) 0%, transparent 60%),
      radial-gradient(ellipse 55% 50% at 90% 95%, rgba(79,142,247,0.10) 0%, transparent 55%),
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
  .orb-a { width: 420px; height: 420px; background: #a78bfa; top: -160px; right: -100px; }
  .orb-b { width: 340px; height: 340px; background: #4f8ef7; bottom: -110px; left: -70px; animation-duration: 28s; animation-delay: -12s; }
  .orb-c { width: 200px; height: 200px; background: #34d399; top: 35%; left: 8%; opacity: 0.07; animation-duration: 18s; animation-delay: -5s; }

  @keyframes drift {
    from { transform: translate(0,0) scale(1); }
    to   { transform: translate(28px,38px) scale(1.07); }
  }

  .su-page {
    position: relative; z-index: 1;
    width: 100%; max-width: 460px;
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
    background: linear-gradient(135deg, var(--accent2), var(--accent));
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
    box-shadow: 0 0 20px rgba(167,139,250,0.5);
  }
  .brand-name {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    background: linear-gradient(90deg, var(--accent2), var(--accent));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }

  /* Card */
  .su-card {
    background: var(--card);
    border: 1px solid var(--card-border);
    border-radius: var(--radius);
    overflow: hidden;
    position: relative;
  }

  .su-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--accent2), var(--accent), transparent);
  }

  /* Hero */
  .su-hero {
    padding: 34px 32px 24px;
    text-align: center;
    border-bottom: 1px solid var(--card-border);
    position: relative; overflow: hidden;
  }

  .su-hero::after {
    content: '';
    position: absolute; left: -50px; top: -50px;
    width: 200px; height: 200px;
    background: radial-gradient(circle, rgba(167,139,250,0.07) 0%, transparent 70%);
    border-radius: 50%; pointer-events: none;
  }

  .su-avatar {
    width: 64px; height: 64px;
    border-radius: 50%;
    margin: 0 auto 16px;
    background: linear-gradient(var(--card), var(--card)) padding-box,
                linear-gradient(135deg, var(--accent2), var(--accent)) border-box;
    border: 2px solid transparent;
    display: flex; align-items: center; justify-content: center;
    font-size: 26px;
    box-shadow: 0 0 22px rgba(167,139,250,0.3);
    position: relative; z-index: 1;
  }

  .su-title {
    font-family: 'Playfair Display', serif;
    font-size: 24px; font-weight: 700;
    margin-bottom: 6px;
    background: linear-gradient(90deg, var(--accent2), var(--accent));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    position: relative; z-index: 1;
  }

  .su-sub {
    font-size: 13.5px; color: var(--muted);
    position: relative; z-index: 1;
  }

  /* Form */
  .su-form-body {
    padding: 26px 32px 28px;
    display: flex; flex-direction: column; gap: 18px;
  }

  .field-group { display: flex; flex-direction: column; gap: 7px; }

  .field-label {
    font-size: 11.5px; font-weight: 600;
    letter-spacing: 0.09em; text-transform: uppercase;
    color: var(--muted);
  }

  .field-wrap {
    position: relative; display: flex; align-items: center;
  }

  .field-icon {
    position: absolute; left: 14px;
    color: var(--muted); font-size: 13px;
    pointer-events: none; transition: color 0.2s;
  }

  .field-wrap:focus-within .field-icon { color: var(--accent2); }

  .field-input {
    width: 100%;
    background: var(--surface2);
    border: 1px solid var(--card-border);
    border-radius: 11px;
    padding: 12px 14px 12px 40px;
    color: var(--text);
    font-family: 'Outfit', sans-serif;
    font-size: 14px; outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }

  .field-input::placeholder { color: var(--muted); }

  .field-input:focus {
    border-color: var(--accent2);
    box-shadow: 0 0 0 3px rgba(167,139,250,0.13);
    background: rgba(167,139,250,0.04);
  }

  /* Error */
  .error-msg {
    font-size: 12px; color: var(--danger);
    display: flex; align-items: center; gap: 5px;
  }

  /* API error banner */
  .api-error {
    background: rgba(248,113,113,0.08);
    border: 1px solid rgba(248,113,113,0.25);
    border-radius: 10px;
    padding: 10px 14px;
    font-size: 13px; color: var(--danger);
    display: flex; align-items: center; gap: 8px;
  }

  /* Password strength */
  .strength-section {
    display: flex; flex-direction: column; gap: 6px;
    animation: fadeUp 0.25s ease both;
  }

  .strength-bar-row {
    display: flex; gap: 4px; margin-bottom: 2px;
  }

  .strength-seg {
    flex: 1; height: 4px; border-radius: 4px;
    background: var(--card-border);
    transition: background 0.3s;
  }

  .strength-seg.fill-weak   { background: var(--danger); }
  .strength-seg.fill-medium { background: var(--gold); }
  .strength-seg.fill-strong { background: var(--accent3); }

  .strength-label {
    font-size: 11px; font-weight: 600;
    letter-spacing: 0.06em; text-transform: uppercase;
    margin-bottom: 4px;
  }

  .strength-label.weak   { color: var(--danger); }
  .strength-label.medium { color: var(--gold); }
  .strength-label.strong { color: var(--accent3); }

  .validation-list {
    display: flex; flex-direction: column; gap: 4px;
  }

  .val-item {
    display: flex; align-items: center; gap: 8px;
    font-size: 12.5px;
    transition: color 0.25s;
  }

  .val-item.pass { color: var(--accent3); }
  .val-item.fail { color: var(--muted); }

  .val-dot {
    width: 16px; height: 16px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 9px; flex-shrink: 0;
    transition: background 0.25s;
  }

  .val-item.pass .val-dot { background: rgba(52,211,153,0.2); color: var(--accent3); }
  .val-item.fail .val-dot { background: rgba(255,255,255,0.06); color: var(--muted); }

  /* Submit */
  .submit-btn {
    width: 100%; padding: 13px;
    border-radius: 50px; border: none;
    background: linear-gradient(135deg, var(--accent2), var(--accent));
    color: white;
    font-family: 'Outfit', sans-serif;
    font-size: 14.5px; font-weight: 700;
    cursor: pointer; letter-spacing: 0.03em;
    transition: transform 0.18s, box-shadow 0.18s, opacity 0.18s;
    box-shadow: 0 4px 22px rgba(167,139,250,0.38);
    display: flex; align-items: center; justify-content: center; gap: 8px;
    margin-top: 4px;
  }

  .submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(167,139,250,0.52); }
  .submit-btn:active:not(:disabled) { transform: translateY(0); opacity: 0.88; }
  .submit-btn:disabled { opacity: 0.38; cursor: not-allowed; }

  /* Footer */
  .su-footer {
    padding: 0 32px 26px;
    text-align: center;
    font-size: 13px; color: var(--muted);
  }

  .su-footer a {
    color: var(--accent2); font-weight: 600;
    text-decoration: none; transition: color 0.15s;
  }
  .su-footer a:hover { color: var(--accent); }

  /* Terms note */
  .terms-note {
    text-align: center;
    font-size: 11.5px; color: var(--muted);
    line-height: 1.6; margin-top: -4px;
  }
  .terms-note a { color: var(--accent2); text-decoration: none; }
  .terms-note a:hover { color: var(--accent); }
`;

const VALIDATIONS = [
  { key: 'capital', label: 'At least one uppercase letter', test: v => /[A-Z]/.test(v) },
  { key: 'number',  label: 'At least one number',           test: v => /[0-9]/.test(v) },
  { key: 'length',  label: 'Minimum 8 characters',          test: v => v.length >= 8 },
];

function getStrength(v) {
  const passed = VALIDATIONS.filter(r => r.test(v)).length;
  if (passed === 0) return { label: '', cls: '', segs: 0 };
  if (passed === 1) return { label: 'Weak',   cls: 'weak',   segs: 1 };
  if (passed === 2) return { label: 'Medium', cls: 'medium', segs: 2 };
  return               { label: 'Strong', cls: 'strong', segs: 3 };
}

export default function SignUp() {
  const [name,setName]=useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validations, setValidations] = useState({ capital: false, number: false, length: false });
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setValidations({
      capital: /[A-Z]/.test(value),
      number:  /[0-9]/.test(value),
      length:  value.length >= 8,
    });
  };

  const allValid = validations.capital && validations.number && validations.length;
  const strength = password.length > 0 ? getStrength(password) : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { setErrorMsg("Please enter your email."); return; }
    setErrorMsg("");
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/user/signup', {name, email, password }, { withCredentials: true });
      navigate('/');
    } catch (err) {
      if (err?.response?.status === 400) {
        setErrorMsg("User already exists. Please log in.");
      } else {
        setErrorMsg("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="su-root">
        <div className="grid-bg" />
        <div className="orb orb-a" />
        <div className="orb orb-b" />
        <div className="orb orb-c" />

        <div className="su-page">
          {/* Brand */}
          <div className="brand-bar">
            <div className="brand-gem">✦</div>
            <span className="brand-name">InterviewAI</span>
          </div>

          <div className="su-card">
            {/* Hero */}
            <div className="su-hero">
              <div className="su-avatar">🚀</div>
              <div className="su-title">Join the Community</div>
              <div className="su-sub">Create your account and start acing interviews</div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="su-form-body">
              {errorMsg && (
                <div className="api-error">⚠️ {errorMsg}</div>
              )}
              <div className="field-group">
                <label className="field-label">Username</label>
                <div className="field-wrap">
                  
                  <input
                    className="field-input"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    
                  />
                </div>
              </div>
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
              </div>

              {/* Password */}
              <div className="field-group">
                <label className="field-label">Password</label>
                <div className="field-wrap">
                  <FaLock className="field-icon" />
                  <input
                    className="field-input"
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="Create a strong password"
                  />
                </div>

                {/* Strength meter */}
                {password.length > 0 && strength && (
                  <div className="strength-section">
                    <div className="strength-bar-row">
                      {[0, 1, 2].map(i => (
                        <div
                          key={i}
                          className={`strength-seg ${i < strength.segs ? `fill-${strength.cls}` : ''}`}
                        />
                      ))}
                    </div>
                    {strength.label && (
                      <div className={`strength-label ${strength.cls}`}>{strength.label}</div>
                    )}
                    <div className="validation-list">
                      {VALIDATIONS.map(rule => {
                        const pass = rule.test(password);
                        return (
                          <div key={rule.key} className={`val-item ${pass ? 'pass' : 'fail'}`}>
                            <div className="val-dot">{pass ? '✓' : '○'}</div>
                            {rule.label}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="terms-note">
                By signing up you agree to our{" "}
                <a href="/terms">Terms of Service</a> and{" "}
                <a href="/privacy">Privacy Policy</a>.
              </div>

              <button type="submit" className="submit-btn" disabled={!allValid || loading}>
                {loading ? 'Creating Account…' : 'Create Account →'}
              </button>
            </form>

            <div className="su-footer">
              Already a member?{" "}
              <a href="/">Login here →</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}