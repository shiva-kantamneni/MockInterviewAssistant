import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { jwtDecode } from "jwt-decode";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:wght@700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #05080f;
    --bg2: #080c16;
    --card: #0c1120;
    --card-border: rgba(255,255,255,0.07);
    --card-hover: #101827;
    --accent: #4f8ef7;
    --accent2: #a78bfa;
    --accent3: #34d399;
    --gold: #f59e0b;
    --text: #e2e8f8;
    --muted: #5a6480;
    --radius: 20px;
  }

  .db-root {
    min-height: 100vh;
    background: var(--bg);
    font-family: 'Outfit', sans-serif;
    color: var(--text);
    position: relative;
    overflow: hidden;
  }

  /* ── Ambient background ── */
  .db-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse 80% 60% at 10% -10%, rgba(79,142,247,0.12) 0%, transparent 60%),
      radial-gradient(ellipse 60% 50% at 90% 110%, rgba(167,139,250,0.10) 0%, transparent 55%),
      radial-gradient(ellipse 40% 40% at 50% 50%, rgba(52,211,153,0.04) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  /* Floating orbs */
  .orb {
    position: fixed;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.18;
    animation: drift 18s ease-in-out infinite alternate;
    pointer-events: none;
    z-index: 0;
  }
  .orb-1 { width: 500px; height: 500px; background: #4f8ef7; top: -200px; left: -100px; animation-duration: 20s; }
  .orb-2 { width: 380px; height: 380px; background: #a78bfa; bottom: -120px; right: -80px; animation-duration: 25s; animation-delay: -8s; }
  .orb-3 { width: 250px; height: 250px; background: #34d399; top: 40%; right: 15%; animation-duration: 16s; animation-delay: -4s; }

  @keyframes drift {
    from { transform: translate(0, 0) scale(1); }
    to   { transform: translate(30px, 40px) scale(1.08); }
  }

  /* Grid dots */
  .grid-bg {
    position: fixed;
    inset: 0;
    background-image:
      radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
    z-index: 0;
  }

  .db-content {
    position: relative;
    z-index: 1;
    max-width: 1100px;
    margin: 0 auto;
    padding: 36px 28px 60px;
  }

  /* ── Top nav bar ── */
  .topnav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 44px;
    animation: slideDown 0.5s ease both;
  }

  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .brand-gem {
    width: 34px; height: 34px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
    box-shadow: 0 0 18px rgba(79,142,247,0.5);
  }

  .brand-name {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    background: linear-gradient(90deg, var(--accent), var(--accent2));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .nav-pills {
    display: flex;
    gap: 6px;
  }

  .nav-pill {
    padding: 7px 16px;
    border-radius: 50px;
    border: 1px solid var(--card-border);
    background: var(--card);
    color: var(--muted);
    font-family: 'Outfit', sans-serif;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .nav-pill:hover { color: var(--text); border-color: var(--accent); }
  .nav-pill.active { background: var(--accent); border-color: var(--accent); color: white; box-shadow: 0 0 14px rgba(79,142,247,0.45); }

  /* ── Hero welcome ── */
  .hero {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--card);
    border: 1px solid var(--card-border);
    border-radius: var(--radius);
    padding: 32px 36px;
    margin-bottom: 32px;
    position: relative;
    overflow: hidden;
    animation: fadeUp 0.5s 0.1s ease both;
  }

  .hero::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--accent), var(--accent2), transparent);
  }

  .hero::after {
    content: '';
    position: absolute;
    right: -60px; top: -60px;
    width: 260px; height: 260px;
    background: radial-gradient(circle, rgba(79,142,247,0.08) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .hero-text h2 {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 8px;
    line-height: 1.2;
  }

  .hero-text h2 .name-highlight {
    background: linear-gradient(90deg, var(--accent), var(--accent2));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hero-text p {
    color: var(--muted);
    font-size: 15px;
    font-weight: 400;
  }

  .hero-stats {
    display: flex;
    gap: 24px;
    align-items: center;
  }

  .stat-block {
    text-align: center;
  }

  .stat-num {
    font-size: 28px;
    font-weight: 700;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .stat-label {
    font-size: 11px;
    color: var(--muted);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-top: 2px;
  }

  .stat-divider {
    width: 1px;
    height: 40px;
    background: var(--card-border);
  }

  .hero-avatar-wrap {
    position: relative;
  }

    .hero-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  color: white;
}


  .avatar-ring {
    position: absolute;
    inset: -6px;
    border-radius: 50%;
    border: 2px solid transparent;
    background: linear-gradient(var(--card), var(--card)) padding-box,
                linear-gradient(135deg, var(--accent), var(--accent2)) border-box;
    animation: spin 8s linear infinite;
    opacity: 0.5;
  }

  .avatar-online {
    position: absolute;
    bottom: 2px; right: 2px;
    width: 14px; height: 14px;
    background: var(--accent3);
    border-radius: 50%;
    border: 2px solid var(--card);
    box-shadow: 0 0 10px var(--accent3);
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  /* ── Cards grid ── */
  .cards-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  .card {
    background: var(--card);
    border: 1px solid var(--card-border);
    border-radius: var(--radius);
    padding: 28px;
    position: relative;
    overflow: hidden;
    transition: transform 0.25s, border-color 0.25s, box-shadow 0.25s;
    animation: fadeUp 0.5s ease both;
  }

  .card:nth-child(1) { animation-delay: 0.15s; }
  .card:nth-child(2) { animation-delay: 0.22s; }
  .card:nth-child(3) { animation-delay: 0.29s; }
  .card:nth-child(4) { animation-delay: 0.36s; }

  .card:hover {
    transform: translateY(-4px);
    border-color: rgba(79,142,247,0.35);
    box-shadow: 0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(79,142,247,0.1);
  }

  /* Accent top bar per card */
  .card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    opacity: 0;
    transition: opacity 0.25s;
  }

  .card:hover::before { opacity: 1; }
  .card:nth-child(1)::before { background: linear-gradient(90deg, var(--accent), var(--accent2)); }
  .card:nth-child(2)::before { background: linear-gradient(90deg, var(--accent2), #f472b6); }
  .card:nth-child(3)::before { background: linear-gradient(90deg, var(--gold), #f97316); }
  .card:nth-child(4)::before { background: linear-gradient(90deg, var(--accent3), var(--accent)); }

  /* Corner glow */
  .card-glow {
    position: absolute;
    top: -40px; right: -40px;
    width: 140px; height: 140px;
    border-radius: 50%;
    opacity: 0.06;
    pointer-events: none;
    transition: opacity 0.3s;
  }

  .card:hover .card-glow { opacity: 0.14; }

  .card-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 18px;
  }

  .card-icon {
    width: 42px; height: 42px;
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 19px;
    flex-shrink: 0;
  }

  .icon-blue  { background: rgba(79,142,247,0.15); box-shadow: 0 0 14px rgba(79,142,247,0.2); }
  .icon-violet{ background: rgba(167,139,250,0.15); box-shadow: 0 0 14px rgba(167,139,250,0.2); }
  .icon-gold  { background: rgba(245,158,11,0.12);  box-shadow: 0 0 14px rgba(245,158,11,0.2); }
  .icon-green { background: rgba(52,211,153,0.12);  box-shadow: 0 0 14px rgba(52,211,153,0.2); }

  .card-title {
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 0.01em;
  }

  .card-desc {
    font-size: 13.5px;
    color: var(--muted);
    line-height: 1.6;
    margin-bottom: 22px;
  }

  /* Buttons */
  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 22px;
    border-radius: 50px;
    border: none;
    background: linear-gradient(135deg, var(--accent), #7c6bef);
    color: white;
    font-family: 'Outfit', sans-serif;
    font-size: 13.5px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.18s, box-shadow 0.18s, opacity 0.18s;
    box-shadow: 0 4px 18px rgba(79,142,247,0.35);
    letter-spacing: 0.02em;
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(79,142,247,0.5);
  }

  .btn-primary:active { transform: translateY(0); opacity: 0.85; }

  .btn-secondary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 22px;
    border-radius: 50px;
    border: 1px solid var(--card-border);
    background: transparent;
    color: var(--text);
    font-family: 'Outfit', sans-serif;
    font-size: 13.5px;
    font-weight: 500;
    cursor: pointer;
    transition: border-color 0.18s, background 0.18s, transform 0.18s;
  }

  .btn-secondary:hover {
    border-color: var(--accent3);
    color: var(--accent3);
    background: rgba(52,211,153,0.06);
    transform: translateY(-1px);
  }

  /* File upload */
  .file-drop {
    border: 1.5px dashed var(--card-border);
    border-radius: 12px;
    padding: 18px;
    text-align: center;
    margin-bottom: 16px;
    cursor: pointer;
    transition: border-color 0.2s, background 0.2s;
    position: relative;
  }

  .file-drop:hover {
    border-color: var(--accent2);
    background: rgba(167,139,250,0.04);
  }

  .file-drop input[type="file"] {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
    width: 100%;
  }

  .file-drop-label {
    font-size: 12.5px;
    color: var(--muted);
    pointer-events: none;
  }

  .file-selected {
    font-size: 12px;
    color: var(--accent2);
    font-weight: 500;
    margin-top: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
  }

  /* History list */
  .history-list { list-style: none; margin-bottom: 16px; display: flex; flex-direction: column; gap: 8px; }

  .history-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 9px 14px;
    background: rgba(255,255,255,0.03);
    border-radius: 10px;
    border: 1px solid var(--card-border);
    transition: background 0.15s;
    font-size: 13px;
  }

  .history-item:hover { background: rgba(255,255,255,0.06); }

  .history-item .hi-title { font-weight: 500; }
  .history-item .hi-date  { color: var(--muted); font-size: 11.5px; }

  .score-badge {
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 11.5px;
    font-weight: 600;
  }

  .score-hi  { background: rgba(52,211,153,0.15); color: var(--accent3); }
  .score-mid { background: rgba(79,142,247,0.15);  color: var(--accent); }
  .score-lo  { background: rgba(245,158,11,0.12);  color: var(--gold); }

  .view-all-link {
    font-size: 12.5px;
    color: var(--accent);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.15s;
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .view-all-link:hover { color: var(--accent2); }

  /* Profile card */
  .profile-row {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 12px;
    background: rgba(255,255,255,0.03);
    border-radius: 12px;
    border: 1px solid var(--card-border);
    margin-bottom: 16px;
  }

  .profile-avatar {
    width: 46px; height: 46px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid transparent;
    background: linear-gradient(var(--card), var(--card)) padding-box,
                linear-gradient(135deg, var(--accent3), var(--accent)) border-box;
  }

  .profile-info .pname { font-size: 14px; font-weight: 600; }
  .profile-info .pemail { font-size: 12px; color: var(--muted); margin-top: 2px; }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 6px; }
`;

const Dashboard = () => {
  const [name, setName] = useState("");
  const [email,setEmail]=useState("");
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    const decoded = jwtDecode(token);
    setName(decoded.name);
    setEmail(decoded.email);
  }, []);
  const user = {
    name: name,
    email: email,
  };

  const navigate = useNavigate();
  const [file, setFile] = useState(null);

  const handleStart = () => navigate("/interview");

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a Resume first");
      return;
    }
    const formData = new FormData();
    formData.append("resume", file);
    navigate("/chat", { state: { fileName: file.name } });
  };

  const history = [
    { title: "Frontend", date: "May 30", score: 78 },
    { title: "React", date: "May 27", score: 85 },
    { title: "JavaScript", date: "May 25", score: 66 },
  ];

  const scoreClass = (s) => (s >= 80 ? "score-hi" : s >= 70 ? "score-mid" : "score-lo");
  const firstLetter =name ?name.charAt(0).toUpperCase() : "?";
  return (
    <>
      <style>{styles}</style>
      <div className="db-root">
        {/* Ambient */}
        <div className="grid-bg" />
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />

        <div className="db-content">
          {/* Nav */}
          <nav className="topnav">
            <div className="brand">
              <div className="brand-gem">✦</div>
              <span className="brand-name">InterviewAI</span>
            </div>
            <div className="nav-pills">
              <button className="nav-pill active">Dashboard</button>
              <button className="nav-pill" onClick={()=>navigate('/experience')}>Experience </button>
              <button className="nav-pill">Progress</button>
            </div>
          </nav>

          {/* Hero */}
          <div className="hero">
            <div className="hero-text">
              <h2>
                Welcome back,{" "}
                <span className="name-highlight">{user.name}</span> 👋
              </h2>
              <p>Ready to land your dream role? Let's get to work.</p>
            </div>

            <div className="hero-stats">
              <div className="stat-block">
                <div className="stat-num">3</div>
                <div className="stat-label">Sessions</div>
              </div>
              <div className="stat-divider" />
              <div className="stat-block">
                <div className="stat-num">76%</div>
                <div className="stat-label">Avg Score</div>
              </div>
              <div className="stat-divider" />
              <div className="stat-block">
                <div className="hero-avatar-wrap" style={{ marginTop: 0 }}>
                  <div className="hero-avatar">
                        {firstLetter}
                              </div>
                  <div className="avatar-ring" />
                  <div className="avatar-online" />
                </div>
              </div>
            </div>
          </div>

          {/* Cards */}
          <div className="cards-grid">
            {/* Quick Start */}
            <div className="card">
              <div className="card-glow" style={{ background: "#4f8ef7" }} />
              <div className="card-header">
                <div className="card-icon icon-blue">🎯</div>
                <div className="card-title">Quick Start</div>
              </div>
              <p className="card-desc">
                Jump straight into a mock interview. Get real-time feedback and improve your answers.
              </p>
              <button className="btn-primary" onClick={handleStart}>
                ▶ Start Interview
              </button>
            </div>

            {/* Resume Upload */}
            <div className="card">
              <div className="card-glow" style={{ background: "#a78bfa" }} />
              <div className="card-header">
                <div className="card-icon icon-violet">📄</div>
                <div className="card-title">Resume Interview</div>
              </div>
              <div className="file-drop">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <div className="file-drop-label">
                  {file ? (
                    <div className="file-selected">✓ {file.name}</div>
                  ) : (
                    <>📁 Click or drop your resume here<br /><span style={{ fontSize: 11, opacity: 0.6 }}>PDF, DOC, DOCX</span></>
                  )}
                </div>
              </div>
              <button className="btn-primary" style={{ background: "linear-gradient(135deg, #a78bfa, #f472b6)" }} onClick={handleUpload}>
                ✦ Start with Resume
              </button>
            </div>

            {/* Interview History */}
            <div className="card">
              <div className="card-glow" style={{ background: "#f59e0b" }} />
              <div className="card-header">
                <div className="card-icon icon-gold">🕓</div>
                <div className="card-title">Interview History</div>
              </div>
              <ul className="history-list">
                {history.map((h) => (
                  <li className="history-item" key={h.title}>
                    <div>
                      <div className="hi-title">{h.title}</div>
                      <div className="hi-date">{h.date}</div>
                    </div>
                    <span className={`score-badge ${scoreClass(h.score)}`}>{h.score}%</span>
                  </li>
                ))}
              </ul>
              <a href="#" className="view-all-link">View All Sessions →</a>
            </div>

            {/* Profile */}
            <div className="card">
              <div className="card-glow" style={{ background: "#34d399" }} />
              <div className="card-header">
                <div className="card-icon icon-green">👤</div>
                <div className="card-title">Your Profile</div>
              </div>
              <div className="profile-row">
                <img className="profile-avatar" src={user.avatar} alt="User" />
                <div className="profile-info">
                  <div className="pname">{user.name}</div>
                  <div className="pemail">{user.email}</div>
                </div>
              </div>
              <button className="btn-secondary" onClick={() => navigate("/profile")}>
                        ✏ Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;