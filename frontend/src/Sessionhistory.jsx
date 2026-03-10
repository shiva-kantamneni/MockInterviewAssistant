import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const HISTORY_URL = "http://localhost:5000/history";

const authHeader = () => {
  const t = localStorage.getItem("token");
  return t ? { Authorization: `Bearer ${t}` } : {};
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0c12;
    --bg2: #0d0f16;
    --surface: #12151e;
    --surface2: #181c28;
    --border: #1e2235;
    --accent: #5b8af5;
    --accent-glow: rgba(91,138,245,0.15);
    --accent2: #e06caa;
    --text: #e2e8f8;
    --muted: #4a5270;
    --muted2: #6b7899;
    --green: #22c55e;
    --red: #ff4757;
    --radius: 14px;
    --ai-bubble: #13172a;
    --user-bubble: #1a2440;
  }

  body { background: var(--bg); }

  .sh-root {
    min-height: 100vh; background: var(--bg);
    font-family: 'Sora', sans-serif; color: var(--text);
    display: flex; flex-direction: column;
  }

  .sh-root::before {
    content: ''; position: fixed; inset: 0;
    background:
      radial-gradient(ellipse 60% 40% at 5% 5%, rgba(91,138,245,0.08) 0%, transparent 60%),
      radial-gradient(ellipse 50% 40% at 95% 95%, rgba(224,108,170,0.06) 0%, transparent 55%);
    pointer-events: none; z-index: 0;
  }

  /* Top bar */
  .sh-topbar {
    position: relative; z-index: 2;
    padding: 16px 32px; border-bottom: 1px solid var(--border);
    background: rgba(10,12,18,0.9); backdrop-filter: blur(16px);
    display: flex; align-items: center; justify-content: space-between; flex-shrink: 0;
  }
  .sh-topbar-left { display: flex; align-items: center; gap: 14px; }
  .back-btn { display: flex; align-items: center; gap: 7px; padding: 7px 16px; border-radius: 20px; border: 1px solid var(--border); background: transparent; color: var(--muted2); font-size: 13px; font-family: 'Sora', sans-serif; cursor: pointer; transition: all 0.18s; }
  .back-btn:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-glow); }
  .sh-brand { display: flex; align-items: center; gap: 9px; }
  .sh-gem { width: 28px; height: 28px; border-radius: 8px; background: linear-gradient(135deg, var(--accent), var(--accent2)); display: flex; align-items: center; justify-content: center; font-size: 13px; }
  .sh-brand-name { font-size: 15px; font-weight: 600; }
  .sh-count { font-family: 'JetBrains Mono', monospace; font-size: 12px; padding: 4px 12px; border-radius: 20px; background: var(--surface); border: 1px solid var(--border); color: var(--muted2); }

  /* Layout */
  .sh-body { position: relative; z-index: 1; flex: 1; display: flex; max-width: 1200px; width: 100%; margin: 0 auto; padding: 28px 24px 40px; gap: 24px; overflow: hidden; }

  /* Session list panel */
  .sh-list-panel { width: 340px; flex-shrink: 0; display: flex; flex-direction: column; gap: 10px; overflow-y: auto; padding-right: 4px; }
  .sh-list-panel::-webkit-scrollbar { width: 4px; }
  .sh-list-panel::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
  .sh-list-heading { font-size: 10px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--muted); margin-bottom: 4px; padding-left: 4px; }

  .sh-session-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 14px 16px; cursor: pointer; transition: all 0.18s; display: flex; align-items: flex-start; gap: 12px; position: relative; animation: fadeUp 0.3s ease both; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  .sh-session-card:hover { border-color: rgba(91,138,245,0.4); background: var(--surface2); transform: translateX(3px); }
  .sh-session-card.active { border-color: var(--accent); background: var(--surface2); box-shadow: 0 0 0 1px rgba(91,138,245,0.2), inset 3px 0 0 var(--accent); }
  .sh-card-icon { font-size: 20px; flex-shrink: 0; margin-top: 1px; }
  .sh-card-body { flex: 1; overflow: hidden; }
  .sh-card-title { font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 4px; }
  .sh-card-meta { font-size: 11px; color: var(--muted2); display: flex; align-items: center; gap: 8px; }
  .sh-card-dot { width: 3px; height: 3px; border-radius: 50%; background: var(--muted); }
  .sh-delete-btn { background: none; border: none; color: var(--muted); cursor: pointer; font-size: 12px; padding: 3px 6px; border-radius: 5px; opacity: 0; transition: opacity 0.15s, color 0.15s; flex-shrink: 0; margin-top: 2px; }
  .sh-session-card:hover .sh-delete-btn { opacity: 1; }
  .sh-delete-btn:hover { color: var(--red); }

  /* Empty state */
  .sh-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; text-align: center; padding: 40px; }
  .sh-empty-icon { width: 56px; height: 56px; border-radius: 16px; background: var(--surface2); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 24px; }
  .sh-empty h3 { font-size: 17px; font-weight: 600; }
  .sh-empty p { font-size: 13px; color: var(--muted2); max-width: 280px; line-height: 1.6; }
  .sh-start-btn { display: inline-flex; align-items: center; gap: 7px; padding: 10px 22px; border-radius: 50px; border: none; background: linear-gradient(135deg, var(--accent), var(--accent2)); color: white; font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 18px rgba(91,138,245,0.3); }
  .sh-start-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(91,138,245,0.45); }

  /* Skeleton */
  .sh-skeleton { display: flex; flex-direction: column; gap: 10px; }
  .sh-skel-card { height: 72px; border-radius: var(--radius); background: var(--surface); border: 1px solid var(--border); overflow: hidden; position: relative; }
  .sh-skel-card::after { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, transparent 30%, rgba(255,255,255,0.03) 50%, transparent 70%); background-size: 200% 100%; animation: shimmer 1.6s infinite; }
  @keyframes shimmer { from{background-position:200% 0} to{background-position:-200% 0} }

  /* Message viewer */
  .sh-viewer { flex: 1; display: flex; flex-direction: column; background: var(--surface); border: 1px solid var(--border); border-radius: 18px; overflow: hidden; min-height: 0; }
  .sh-viewer-header { padding: 18px 24px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; background: var(--surface2); }
  .sh-viewer-title { font-size: 15px; font-weight: 600; display: flex; align-items: center; gap: 10px; }
  .sh-viewer-icon { font-size: 20px; }
  .sh-viewer-meta { font-size: 11px; color: var(--muted2); margin-top: 3px; font-family: 'JetBrains Mono', monospace; }
  .sh-viewer-tag { padding: 4px 12px; border-radius: 20px; background: rgba(91,138,245,0.1); border: 1px solid rgba(91,138,245,0.25); color: var(--accent); font-size: 11px; font-family: 'JetBrains Mono', monospace; }

  .sh-messages { flex: 1; overflow-y: auto; padding: 24px; display: flex; flex-direction: column; gap: 18px; }
  .sh-messages::-webkit-scrollbar { width: 4px; }
  .sh-messages::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

  .sh-msg-row { display: flex; gap: 10px; animation: fadeUp 0.2s ease both; }
  .sh-msg-row.user { flex-direction: row-reverse; }

  .sh-ai-avatar { width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0; background: linear-gradient(135deg, var(--accent), var(--accent2)); display: flex; align-items: center; justify-content: center; font-size: 12px; }
  .sh-user-avatar-letter { width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0; background: linear-gradient(135deg, #6366f1, #8b5cf6); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: white; font-family: 'Sora', sans-serif; }

  .sh-bubble { max-width: 72%; padding: 11px 15px; border-radius: 12px; font-size: 13.5px; line-height: 1.65; word-break: break-word; }
  .sh-bubble.ai { background: var(--ai-bubble); border: 1px solid var(--border); border-top-left-radius: 4px; }
  .sh-bubble.user { background: var(--user-bubble); border: 1px solid rgba(91,138,245,0.25); border-top-right-radius: 4px; }
  .sh-bubble-time { font-size: 10px; color: var(--muted); margin-top: 4px; font-family: 'JetBrains Mono', monospace; }
  .sh-msg-row.user .sh-bubble-time { text-align: right; }

  /* Viewer states */
  .sh-viewer-empty { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; text-align: center; padding: 40px; }
  .sh-viewer-empty .ve-icon { font-size: 40px; opacity: 0.3; }
  .sh-viewer-empty p { font-size: 14px; color: var(--muted2); }
  .sh-viewer-loading { flex: 1; display: flex; align-items: center; justify-content: center; }
  .sh-spinner { width: 28px; height: 28px; border: 2px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.85s linear infinite; }
  @keyframes spin { to{transform:rotate(360deg)} }
`;

function relativeMeta(date, msgCount) {
  const diff = Date.now() - new Date(date).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  let when = "Just now";
  if (mins  > 1)  when = `${mins}m ago`;
  if (hours >= 1) when = hours === 1 ? "1 hr ago" : `${hours} hrs ago`;
  if (days === 1) when = "Yesterday";
  if (days  > 1)  when = `${days} days ago`;
  return `${when} · ${msgCount} msg${msgCount !== 1 ? "s" : ""}`;
}

const SessionHistory = () => {
  const navigate = useNavigate();

  const [sessions,       setSessions]       = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [activeId,       setActiveId]       = useState(null);
  const [activeSession,  setActiveSession]  = useState(null);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [userInitial,    setUserInitial]    = useState("U");

  // ── Fetch sidebar list ────────────────────────────────────────────────────
  const fetchSessions = useCallback(async () => {
    try {
      const res = await axios.get(`${HISTORY_URL}/sessions`, { headers: authHeader() });
      setSessions(res.data.sessions || []);
    } catch {
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/"); return; }
    try {
      const decoded = jwtDecode(token);
      const name = decoded.name || decoded.email || "U";
      setUserInitial(name.charAt(0).toUpperCase());
    } catch { navigate("/"); return; }
    fetchSessions();
  }, [fetchSessions]);

  // ── Load a session ────────────────────────────────────────────────────────
  const openSession = useCallback(async (id) => {
    if (id === activeId) return;
    setActiveId(id);
    setActiveSession(null);
    setSessionLoading(true);
    try {
      const res = await axios.get(`${HISTORY_URL}/sessions/${id}`, { headers: authHeader() });
      setActiveSession(res.data.session);
    } catch {
      setActiveSession(null);
    } finally {
      setSessionLoading(false);
    }
  }, [activeId]);

  // ── Delete a session ──────────────────────────────────────────────────────
  const deleteSession = useCallback(async (e, id) => {
    e.stopPropagation();
    try {
      await axios.delete(`${HISTORY_URL}/sessions/${id}`, { headers: authHeader() });
      setSessions(prev => prev.filter(s => s.id !== id));
      if (id === activeId) { setActiveId(null); setActiveSession(null); }
    } catch {}
  }, [activeId]);

  const activeInfo = sessions.find(s => s.id === activeId);

  return (
    <>
      <style>{styles}</style>
      <div className="sh-root">

        {/* Top bar */}
        <div className="sh-topbar">
          <div className="sh-topbar-left">
            <button className="back-btn" onClick={() => navigate("/dashboard")}>← Dashboard</button>
            <div className="sh-brand">
              <div className="sh-gem">✦</div>
              <span className="sh-brand-name">Interview History</span>
            </div>
          </div>
          <span className="sh-count">{sessions.length} session{sessions.length !== 1 ? "s" : ""}</span>
        </div>

        <div className="sh-body">

          {/* ── Left: session list ── */}
          <div className="sh-list-panel">
            <div className="sh-list-heading">All Sessions</div>

            {loading ? (
              <div className="sh-skeleton">
                {[1,2,3,4].map(i => <div key={i} className="sh-skel-card" style={{animationDelay:`${i*0.08}s`}}/>)}
              </div>
            ) : sessions.length === 0 ? (
              <div className="sh-empty">
                <div className="sh-empty-icon">🗂️</div>
                <h3>No sessions yet</h3>
                <p>Complete an interview to see your history here.</p>
                <button className="sh-start-btn" onClick={() => navigate("/dashboard")}>▶ Start Interview</button>
              </div>
            ) : (
              sessions.map((s, idx) => (
                <div
                  key={s.id}
                  className={`sh-session-card ${activeId === s.id ? "active" : ""}`}
                  style={{ animationDelay: `${idx * 0.05}s` }}
                  onClick={() => openSession(s.id)}
                >
                  <span className="sh-card-icon">{s.icon}</span>
                  <div className="sh-card-body">
                    <div className="sh-card-title">{s.title}</div>
                    <div className="sh-card-meta">
                      <span>{s.meta}</span>
                      {s.fileName && (<><div className="sh-card-dot"/><span>📄 {s.fileName}</span></>)}
                    </div>
                  </div>
                  <button className="sh-delete-btn" title="Delete" onClick={(e) => deleteSession(e, s.id)}>✕</button>
                </div>
              ))
            )}
          </div>

          {/* ── Right: message viewer ── */}
          <div className="sh-viewer">
            {!activeId ? (
              <div className="sh-viewer-empty">
                <div className="ve-icon">💬</div>
                <p>Select a session on the left to view its transcript.</p>
              </div>
            ) : sessionLoading ? (
              <div className="sh-viewer-loading"><div className="sh-spinner"/></div>
            ) : !activeSession ? (
              <div className="sh-viewer-empty">
                <div className="ve-icon">⚠️</div>
                <p>Could not load this session.</p>
              </div>
            ) : (
              <>
                <div className="sh-viewer-header">
                  <div>
                    <div className="sh-viewer-title">
                      <span className="sh-viewer-icon">{activeInfo?.icon}</span>
                      {activeSession.title}
                    </div>
                    <div className="sh-viewer-meta">{activeInfo?.meta}</div>
                  </div>
                  {activeSession.fileName && (
                    <span className="sh-viewer-tag">📄 {activeSession.fileName}</span>
                  )}
                </div>

                <div className="sh-messages">
                  {(activeSession.messages || []).length === 0 ? (
                    <div className="sh-viewer-empty">
                      <div className="ve-icon">🤫</div>
                      <p>No messages in this session.</p>
                    </div>
                  ) : (
                    (activeSession.messages || []).map((msg, i) => (
                      <div key={i} className={`sh-msg-row ${msg.role}`}>
                        {msg.role === "ai"
                          ? <div className="sh-ai-avatar">✦</div>
                          : <div className="sh-user-avatar-letter">{userInitial}</div>
                        }
                        <div style={{ maxWidth: "72%" }}>
                          <div className={`sh-bubble ${msg.role}`}>{msg.content}</div>
                          {msg.time && <div className="sh-bubble-time">{msg.time}</div>}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </>
  );
};

export default SessionHistory;