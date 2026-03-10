import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const authHeader = () => {
  const t = localStorage.getItem("token");
  return t ? { Authorization: `Bearer ${t}` } : {};
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #05080f; --card: #0c1120; --card-border: rgba(255,255,255,0.07);
    --surface2: #0f1623; --accent: #4f8ef7; --accent2: #a78bfa;
    --accent3: #34d399; --gold: #f59e0b; --rose: #f472b6; --danger: #f87171;
    --text: #e2e8f8; --muted: #5a6480; --radius: 20px;
  }
  body { background: var(--bg); }
  .profile-root { min-height:100vh; background:var(--bg); font-family:'Outfit',sans-serif; color:var(--text); position:relative; overflow-x:hidden; }
  .profile-root::before { content:''; position:fixed; inset:0; background: radial-gradient(ellipse 70% 55% at 10% 0%, rgba(79,142,247,0.10) 0%, transparent 60%), radial-gradient(ellipse 55% 45% at 90% 100%, rgba(167,139,250,0.09) 0%, transparent 55%); pointer-events:none; z-index:0; }
  .grid-bg { position:fixed; inset:0; background-image:radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px); background-size:38px 38px; pointer-events:none; z-index:0; }
  .orb { position:fixed; border-radius:50%; filter:blur(90px); opacity:0.12; animation:drift 22s ease-in-out infinite alternate; pointer-events:none; z-index:0; }
  .orb-a { width:400px; height:400px; background:#4f8ef7; top:-150px; left:-90px; }
  .orb-b { width:320px; height:320px; background:#a78bfa; bottom:-100px; right:-60px; animation-duration:26s; animation-delay:-11s; }
  @keyframes drift { from{transform:translate(0,0) scale(1);} to{transform:translate(28px,38px) scale(1.07);} }
  .profile-content { position:relative; z-index:1; max-width:720px; margin:0 auto; padding:36px 28px 80px; }

  .topnav { display:flex; align-items:center; justify-content:space-between; margin-bottom:48px; animation:fadeDown 0.4s ease both; }
  @keyframes fadeDown { from{opacity:0;transform:translateY(-14px);} to{opacity:1;transform:translateY(0);} }
  .brand { display:flex; align-items:center; gap:10px; cursor:pointer; }
  .brand-gem { width:32px; height:32px; background:linear-gradient(135deg,var(--accent),var(--accent2)); border-radius:9px; display:flex; align-items:center; justify-content:center; font-size:15px; box-shadow:0 0 18px rgba(79,142,247,0.45); }
  .brand-name { font-family:'Playfair Display',serif; font-size:19px; background:linear-gradient(90deg,var(--accent),var(--accent2)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  .nav-right { display:flex; align-items:center; gap:8px; }
  .back-btn { display:flex; align-items:center; gap:7px; padding:8px 18px; border-radius:50px; border:1px solid var(--card-border); background:var(--card); color:var(--muted); font-family:'Outfit',sans-serif; font-size:13px; font-weight:500; cursor:pointer; transition:all 0.2s; }
  .back-btn:hover { color:var(--text); border-color:var(--accent); }
  .logout-btn { display:flex; align-items:center; gap:7px; padding:8px 18px; border-radius:50px; border:1px solid rgba(248,113,113,0.25); background:rgba(248,113,113,0.06); color:var(--danger); font-family:'Outfit',sans-serif; font-size:13px; font-weight:500; cursor:pointer; transition:all 0.2s; }
  .logout-btn:hover { background:rgba(248,113,113,0.14); border-color:var(--danger); }

  @keyframes fadeUp { from{opacity:0;transform:translateY(18px);} to{opacity:1;transform:translateY(0);} }

  .profile-hero { background:var(--card); border:1px solid var(--card-border); border-radius:var(--radius); overflow:hidden; margin-bottom:20px; animation:fadeUp 0.45s 0.05s ease both; }
  .hero-banner { height:90px; background:linear-gradient(135deg,#0d1f3f 0%,#1a1040 40%,#0d2f2a 100%); position:relative; overflow:hidden; }
  .hero-banner::before { content:''; position:absolute; inset:0; background: radial-gradient(ellipse 60% 80% at 20% 50%,rgba(79,142,247,0.25) 0%,transparent 60%), radial-gradient(ellipse 50% 70% at 80% 50%,rgba(167,139,250,0.20) 0%,transparent 60%); }
  .hero-banner-line { position:absolute; bottom:0; left:0; right:0; height:2px; background:linear-gradient(90deg,var(--accent),var(--accent2),var(--rose)); }
  .hero-body { padding:0 32px 28px; display:flex; align-items:flex-end; gap:20px; margin-top:-36px; }
  .avatar-ring { width:80px; height:80px; border-radius:50%; padding:3px; background:linear-gradient(135deg,var(--accent),var(--accent2)); flex-shrink:0; box-shadow:0 0 24px rgba(79,142,247,0.4); animation:popIn 0.5s 0.2s cubic-bezier(0.34,1.56,0.64,1) both; }
  @keyframes popIn { from{transform:scale(0.6);opacity:0;} to{transform:scale(1);opacity:1;} }
  .avatar-inner { width:100%; height:100%; border-radius:50%; background:linear-gradient(135deg,#1a2a4a,#2a1a4a); border:3px solid var(--card); display:flex; align-items:center; justify-content:center; font-size:28px; font-weight:700; color:white; font-family:'Playfair Display',serif; }
  .hero-info { flex:1; padding-bottom:4px; }
  .hero-name { font-family:'Playfair Display',serif; font-size:22px; font-weight:700; line-height:1.2; margin-bottom:4px; }
  .hero-email { font-size:13px; color:var(--muted); display:flex; align-items:center; gap:6px; }
  .hero-email::before { content:'✉'; font-size:11px; }
  .hero-badge { padding:5px 14px; border-radius:50px; background:rgba(79,142,247,0.12); border:1px solid rgba(79,142,247,0.25); color:var(--accent); font-size:12px; font-weight:600; display:flex; align-items:center; gap:6px; align-self:flex-end; margin-bottom:4px; white-space:nowrap; }

  .stats-row { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-bottom:20px; animation:fadeUp 0.45s 0.1s ease both; }
  .stat-card { background:var(--card); border:1px solid var(--card-border); border-radius:14px; padding:16px 20px; display:flex; align-items:center; gap:12px; transition:border-color 0.2s,transform 0.2s; }
  .stat-card:hover { border-color:rgba(79,142,247,0.25); transform:translateY(-2px); }
  .stat-icon { width:38px; height:38px; border-radius:10px; display:flex; align-items:center; justify-content:center; font-size:16px; flex-shrink:0; }
  .si-blue   { background:rgba(79,142,247,0.14);  box-shadow:0 0 10px rgba(79,142,247,0.18); }
  .si-violet { background:rgba(167,139,250,0.14); box-shadow:0 0 10px rgba(167,139,250,0.18); }
  .si-green  { background:rgba(52,211,153,0.12);  box-shadow:0 0 10px rgba(52,211,153,0.18); }
  .stat-val { font-size:20px; font-weight:700; line-height:1; }
  .stat-lbl { font-size:11px; color:var(--muted); margin-top:3px; letter-spacing:0.04em; }

  .form-card { background:var(--card); border:1px solid var(--card-border); border-radius:var(--radius); overflow:hidden; animation:fadeUp 0.45s 0.15s ease both; margin-bottom:20px; }
  .form-card-top { height:3px; background:linear-gradient(90deg,var(--accent),var(--accent2),var(--rose)); }
  .form-inner { padding:32px; }
  .section-title { font-size:13px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:var(--accent); margin-bottom:24px; display:flex; align-items:center; gap:8px; }
  .section-title::after { content:''; flex:1; height:1px; background:var(--card-border); }
  .fields-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; margin-bottom:20px; }
  .field { display:flex; flex-direction:column; gap:8px; }
  .field-label { font-size:11.5px; font-weight:600; letter-spacing:0.08em; text-transform:uppercase; color:var(--muted); }
  .field-input { width:100%; background:var(--surface2); border:1px solid var(--card-border); border-radius:12px; padding:12px 16px; color:var(--text); font-family:'Outfit',sans-serif; font-size:14px; outline:none; transition:border-color 0.2s,box-shadow 0.2s,background 0.2s; }
  .field-input::placeholder { color:var(--muted); }
  .field-input:focus { border-color:var(--accent); box-shadow:0 0 0 3px rgba(79,142,247,0.12); background:rgba(15,22,35,0.9); }
  .field-input:disabled { opacity:0.45; cursor:not-allowed; }
  .field-hint { font-size:11px; color:var(--muted); margin-top:2px; }
  .pwd-row { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:8px; }
  .form-actions { display:flex; align-items:center; justify-content:flex-end; gap:10px; padding-top:24px; border-top:1px solid var(--card-border); }
  .btn-secondary { padding:11px 24px; border-radius:50px; border:1px solid var(--card-border); background:transparent; color:var(--muted); font-family:'Outfit',sans-serif; font-size:13.5px; font-weight:500; cursor:pointer; transition:all 0.18s; }
  .btn-secondary:hover { border-color:rgba(255,255,255,0.2); color:var(--text); }
  .btn-primary { display:flex; align-items:center; gap:8px; padding:11px 26px; border-radius:50px; border:none; background:linear-gradient(135deg,var(--accent),var(--accent2)); color:white; font-family:'Outfit',sans-serif; font-size:13.5px; font-weight:600; cursor:pointer; box-shadow:0 4px 20px rgba(79,142,247,0.38); transition:transform 0.18s,box-shadow 0.18s,opacity 0.18s; }
  .btn-primary:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 28px rgba(79,142,247,0.5); }
  .btn-primary:disabled { opacity:0.4; cursor:not-allowed; }

  .danger-zone { background:rgba(248,113,113,0.05); border:1px solid rgba(248,113,113,0.15); border-radius:14px; padding:20px 24px; display:flex; align-items:center; justify-content:space-between; animation:fadeUp 0.45s 0.2s ease both; }
  .danger-title { font-size:14px; font-weight:600; color:var(--danger); margin-bottom:3px; }
  .danger-desc  { font-size:12.5px; color:var(--muted); }
  .btn-danger { padding:9px 20px; border-radius:50px; border:1px solid var(--danger); background:transparent; color:var(--danger); font-family:'Outfit',sans-serif; font-size:13px; font-weight:600; cursor:pointer; transition:all 0.18s; white-space:nowrap; }
  .btn-danger:hover { background:rgba(248,113,113,0.1); }

  .confirm-overlay { position:fixed; inset:0; z-index:9999; background:rgba(0,0,0,0.78); backdrop-filter:blur(8px); display:flex; align-items:center; justify-content:center; padding:20px; animation:overlayIn 0.2s ease; }
  @keyframes overlayIn { from{opacity:0;} to{opacity:1;} }
  .confirm-modal { background:var(--card); border:1px solid rgba(248,113,113,0.25); border-radius:var(--radius); width:100%; max-width:420px; overflow:hidden; animation:modalUp 0.3s cubic-bezier(0.34,1.3,0.64,1); }
  @keyframes modalUp { from{opacity:0;transform:translateY(28px) scale(0.96);} to{opacity:1;transform:translateY(0) scale(1);} }
  .confirm-modal-top { height:3px; background:linear-gradient(90deg,var(--danger),var(--rose)); }
  .confirm-modal-body { padding:28px 28px 20px; }
  .confirm-icon { width:52px; height:52px; border-radius:14px; background:rgba(248,113,113,0.1); border:1px solid rgba(248,113,113,0.2); display:flex; align-items:center; justify-content:center; font-size:22px; margin-bottom:16px; }
  .confirm-title { font-family:'Playfair Display',serif; font-size:20px; margin-bottom:8px; color:var(--text); }
  .confirm-desc { font-size:13.5px; color:var(--muted); line-height:1.7; }
  .confirm-modal-footer { padding:0 28px 24px; display:flex; gap:10px; justify-content:flex-end; }
  .confirm-input-wrap { padding:0 28px 16px; }
  .confirm-input { width:100%; background:var(--surface2); border:1px solid rgba(248,113,113,0.25); border-radius:11px; padding:11px 15px; color:var(--text); font-family:'Outfit',sans-serif; font-size:14px; outline:none; transition:border-color 0.2s,box-shadow 0.2s; }
  .confirm-input:focus { border-color:var(--danger); box-shadow:0 0 0 3px rgba(248,113,113,0.12); }
  .confirm-input::placeholder { color:var(--muted); }

  .toast { position:fixed; bottom:32px; left:50%; transform:translateX(-50%); background:var(--card); border:1px solid var(--accent3); border-radius:50px; padding:12px 24px; display:flex; align-items:center; gap:10px; font-size:13.5px; font-weight:500; color:var(--accent3); box-shadow:0 8px 32px rgba(0,0,0,0.4); z-index:10000; animation:toastIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both; }
  @keyframes toastIn { from{opacity:0;transform:translateX(-50%) translateY(20px);} to{opacity:1;transform:translateX(-50%) translateY(0);} }
  .toast-error { border-color:var(--danger); color:var(--danger); }

  .profile-loading { display:flex; align-items:center; justify-content:center; min-height:100vh; background:var(--bg); font-family:'Outfit',sans-serif; color:var(--muted); gap:10px; }
  .loading-dot { width:8px; height:8px; border-radius:50%; background:var(--accent); animation:bounce 1.2s ease-in-out infinite; }
  .loading-dot:nth-child(2){animation-delay:0.2s;background:var(--accent2);}
  .loading-dot:nth-child(3){animation-delay:0.4s;background:var(--accent3);}
  @keyframes bounce { 0%,80%,100%{transform:scale(0.6);opacity:0.4;} 40%{transform:scale(1);opacity:1;} }

  ::-webkit-scrollbar{width:5px;}
  ::-webkit-scrollbar-track{background:transparent;}
  ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.1);border-radius:5px;}

  @media(max-width:600px){
    .fields-grid,.pwd-row,.stats-row{grid-template-columns:1fr;}
    .hero-body{flex-direction:column;align-items:flex-start;gap:10px;}
    .hero-badge{align-self:flex-start;}
    .form-inner{padding:24px;}
    .danger-zone{flex-direction:column;gap:14px;align-items:flex-start;}
    .nav-right { gap:6px; }
    .back-btn span { display:none; }
  }
`;

// ── Helper: extract profile fields from a token ───────────────────────────────
const loadFromToken = (token) => {
  const decoded = jwtDecode(token);
  return {
    name:     decoded.name  || "",
    email:    decoded.email || "",
    initials: (decoded.name || decoded.email || "U")[0].toUpperCase(),
    joinDate: decoded.iat
      ? new Date(decoded.iat * 1000).toLocaleDateString("en-US", { month: "long", year: "numeric" })
      : "",
  };
};

export default function ProfilePage() {
  const navigate = useNavigate();

  const [form, setForm]               = useState({ name: "", email: "" });
  const [passwords, setPasswords]     = useState({ current: "", newPwd: "", confirm: "" });
  const [loading, setLoading]         = useState(true);
  const [savingName, setSavingName]   = useState(false);
  const [savingPwd, setSavingPwd]     = useState(false);
  const [deleting, setDeleting]       = useState(false);
  const [toast, setToast]             = useState(null);
  const [initials, setInitials]       = useState("U");
  const [joinDate, setJoinDate]       = useState("");
  const [interviewCount, setInterviewCount] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  // ── Init ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/"); return; }
    try {
      const { name, email, initials: ini, joinDate: jd } = loadFromToken(token);
      setForm({ name, email });
      setInitials(ini);
      setJoinDate(jd);
    } catch { navigate("/"); return; }

    const fetchStats = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/shareEx/myCount", { headers: authHeader() });
        setInterviewCount(data.count ?? 0);
      } catch {
        setInterviewCount(0);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [navigate]);

  const showToast = (msg, isError = false) => {
    setToast({ msg, isError });
    setTimeout(() => setToast(null), 3200);
  };

  const handleChange    = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const handlePwdChange = (k, v) => setPasswords(p => ({ ...p, [k]: v }));

  // ── Update name ──────────────────────────────────────────────────────────
  const handleSaveName = async () => {
    if (!form.name.trim()) { showToast("Name cannot be empty", true); return; }
    setSavingName(true);
    try {
      const { data } = await axios.put(
        "http://localhost:5000/user/updateName",
        { name: form.name.trim() },
        { headers: authHeader() }
      );

      // ── KEY FIX: save the fresh token returned by the backend ──
      // This ensures the new name is in localStorage so on next
      // page load / refresh, jwtDecode returns the updated value.
      if (data.token) {
        localStorage.setItem("token", data.token);
        const { name, email, initials: ini, joinDate: jd } = loadFromToken(data.token);
        setForm({ name, email });
        setInitials(ini);
        setJoinDate(jd);
      } else {
        setInitials(form.name.trim()[0].toUpperCase());
      }

      showToast("Name updated successfully ✦");
    } catch {
      showToast("Failed to update name", true);
    } finally {
      setSavingName(false);
    }
  };

  // ── Update password ──────────────────────────────────────────────────────
  const handleSavePassword = async () => {
    if (!passwords.current) { showToast("Enter your current password", true); return; }
    if (!passwords.newPwd)  { showToast("Enter a new password", true); return; }
    if (passwords.newPwd !== passwords.confirm) { showToast("Passwords do not match", true); return; }
    if (passwords.newPwd.length < 6) { showToast("Password must be at least 6 characters", true); return; }
    setSavingPwd(true);
    try {
      await axios.put(
        "http://localhost:5000/user/updatePassword",
        { currentPassword: passwords.current, newPassword: passwords.newPwd },
        { headers: authHeader() }   // ← fixed: was withCredentials
      );
      setPasswords({ current: "", newPwd: "", confirm: "" });
      showToast("Password updated successfully ✦");
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to update password";
      showToast(msg, true);
    } finally {
      setSavingPwd(false);
    }
  };

  // ── Logout ───────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/user/logout", {}, { headers: authHeader() });
    } catch { /* ignore */ }
    localStorage.removeItem("token");
    navigate("/");
  };

  // ── Delete account ───────────────────────────────────────────────────────
  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      showToast('Type "DELETE" to confirm', true); return;
    }
    setDeleting(true);
    try {
      await axios.delete(
        "http://localhost:5000/user/deleteAccount",
        { headers: authHeader() }   // ← fixed: was withCredentials
      );
      localStorage.removeItem("token");
      navigate("/");
    } catch {
      showToast("Failed to delete account. Try again.", true);
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-loading">
        <style>{styles}</style>
        <div className="loading-dot" /><div className="loading-dot" /><div className="loading-dot" />
      </div>
    );
  }

  return (
    <>
      <style>{styles}</style>

      {toast && (
        <div className={`toast ${toast.isError ? "toast-error" : ""}`}>
          {toast.isError ? "✕" : "✓"} {toast.msg}
        </div>
      )}

      {showDeleteModal && (
        <div className="confirm-overlay" onClick={e => e.target === e.currentTarget && setShowDeleteModal(false)}>
          <div className="confirm-modal">
            <div className="confirm-modal-top" />
            <div className="confirm-modal-body">
              <div className="confirm-icon">🗑️</div>
              <div className="confirm-title">Delete Account</div>
              <p className="confirm-desc">
                This will permanently delete your account and all your shared experiences.
                This action <strong style={{ color: "var(--danger)" }}>cannot be undone</strong>.
                <br /><br />Type <strong style={{ color: "var(--text)" }}>DELETE</strong> to confirm.
              </p>
            </div>
            <div className="confirm-input-wrap">
              <input
                className="confirm-input"
                placeholder='Type "DELETE" to confirm'
                value={deleteConfirmText}
                onChange={e => setDeleteConfirmText(e.target.value)}
              />
            </div>
            <div className="confirm-modal-footer">
              <button className="btn-secondary" onClick={() => { setShowDeleteModal(false); setDeleteConfirmText(""); }}>
                Cancel
              </button>
              <button
                className="btn-danger"
                onClick={handleDeleteAccount}
                disabled={deleting || deleteConfirmText !== "DELETE"}
                style={{ opacity: deleteConfirmText !== "DELETE" ? 0.45 : 1 }}
              >
                {deleting ? "Deleting…" : "Delete Forever"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="profile-root">
        <div className="grid-bg" />
        <div className="orb orb-a" />
        <div className="orb orb-b" />

        <div className="profile-content">

          <nav className="topnav">
            <div className="brand" onClick={() => navigate("/dashboard")}>
              <div className="brand-gem">✦</div>
              <span className="brand-name">InterviewAI</span>
            </div>
            <div className="nav-right">
              <button className="back-btn" onClick={() => navigate("/dashboard")}>← <span>Dashboard</span></button>
              <button className="logout-btn" onClick={handleLogout}>⎋ Logout</button>
            </div>
          </nav>

          <div className="profile-hero">
            <div className="hero-banner"><div className="hero-banner-line" /></div>
            <div className="hero-body">
              <div className="avatar-ring">
                <div className="avatar-inner">{initials}</div>
              </div>
              <div className="hero-info">
                <div className="hero-name">{form.name || "Your Name"}</div>
                <div className="hero-email">{form.email || "your@email.com"}</div>
              </div>
              <div className="hero-badge">✦ Active Member</div>
            </div>
          </div>

          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-icon si-blue">📝</div>
              <div>
                <div className="stat-val">{interviewCount === null ? "…" : interviewCount}</div>
                <div className="stat-lbl">Interviews Practiced</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon si-violet">🏅</div>
              <div>
                <div className="stat-val" style={{ fontSize: 13, marginTop: 2 }}>
                  {interviewCount > 0 ? "Contributor" : "Explorer"}
                </div>
                <div className="stat-lbl">Community Role</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon si-green">📅</div>
              <div>
                <div className="stat-val" style={{ fontSize: 13, marginTop: 2 }}>{joinDate || "—"}</div>
                <div className="stat-lbl">Member Since</div>
              </div>
            </div>
          </div>

          {/* Update Name */}
          <div className="form-card">
            <div className="form-card-top" />
            <div className="form-inner">
              <div className="section-title">Update Name</div>
              <div className="fields-grid">
                <div className="field">
                  <label className="field-label">Full Name</label>
                  <input
                    className="field-input"
                    placeholder="e.g. Priya Sharma"
                    value={form.name}
                    onChange={e => handleChange("name", e.target.value)}
                  />
                </div>
                <div className="field">
                  <label className="field-label">Email Address</label>
                  <input className="field-input" value={form.email} disabled />
                  <span className="field-hint">Email cannot be changed.</span>
                </div>
              </div>
              <div className="form-actions">
                <button className="btn-primary" onClick={handleSaveName} disabled={savingName}>
                  {savingName
                    ? <><span>Saving</span><span style={{ display:"inline-block", animation:"spin 1s linear infinite" }}>⟳</span></>
                    : <><span>Update Name</span><span>✦</span></>}
                </button>
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="form-card">
            <div className="form-card-top" style={{ background: "linear-gradient(90deg, var(--accent2), var(--rose))" }} />
            <div className="form-inner">
              <div className="section-title" style={{ color: "var(--accent2)" }}>Change Password</div>
              <div className="pwd-row">
                <div className="field">
                  <label className="field-label">Current Password</label>
                  <input className="field-input" type="password" placeholder="••••••••" value={passwords.current} onChange={e => handlePwdChange("current", e.target.value)} />
                </div>
                <div className="field">
                  <label className="field-label">New Password</label>
                  <input className="field-input" type="password" placeholder="••••••••" value={passwords.newPwd} onChange={e => handlePwdChange("newPwd", e.target.value)} />
                </div>
              </div>
              <div className="field" style={{ marginBottom: 8 }}>
                <label className="field-label">Confirm New Password</label>
                <input className="field-input" type="password" placeholder="••••••••" value={passwords.confirm} onChange={e => handlePwdChange("confirm", e.target.value)} />
              </div>
              <span className="field-hint" style={{ display: "block", marginBottom: 4 }}>
                Leave blank to keep your current password.
              </span>
              <div className="form-actions">
                <button className="btn-secondary" onClick={() => setPasswords({ current: "", newPwd: "", confirm: "" })}>Clear</button>
                <button
                  className="btn-primary"
                  onClick={handleSavePassword}
                  disabled={savingPwd}
                  style={{ background: "linear-gradient(135deg, var(--accent2), var(--rose))", boxShadow: "0 4px 20px rgba(167,139,250,0.35)" }}
                >
                  {savingPwd
                    ? <><span>Saving</span><span style={{ display:"inline-block", animation:"spin 1s linear infinite" }}>⟳</span></>
                    : <><span>Update Password</span><span>✦</span></>}
                </button>
              </div>
            </div>
          </div>

          {/* Danger zone */}
          <div className="danger-zone">
            <div>
              <div className="danger-title">Delete Account</div>
              <div className="danger-desc">Permanently remove your account and all shared experiences.</div>
            </div>
            <button className="btn-danger" onClick={() => { setShowDeleteModal(true); setDeleteConfirmText(""); }}>
              Delete Account
            </button>
          </div>

        </div>
      </div>
    </>
  );
}