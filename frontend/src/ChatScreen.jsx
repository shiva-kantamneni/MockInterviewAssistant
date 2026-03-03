import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0d0f14;
    --sidebar-bg: #111318;
    --surface: #181b22;
    --surface2: #1e2130;
    --border: #2a2d3a;
    --accent: #5b8af5;
    --accent-glow: rgba(91,138,245,0.18);
    --accent2: #e06caa;
    --text: #e8eaf0;
    --text-muted: #6b7185;
    --user-bubble: #1e2b4a;
    --ai-bubble: #181b22;
    --radius: 14px;
  }

  .chat-root {
    display: flex;
    height: 100vh;
    background: var(--bg);
    font-family: 'Sora', sans-serif;
    color: var(--text);
    overflow: hidden;
  }

  /* ── Sidebar ── */
  .sidebar {
    width: 25%;
    min-width: 220px;
    max-width: 300px;
    background: var(--sidebar-bg);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .sidebar-header {
    padding: 22px 20px 16px;
    border-bottom: 1px solid var(--border);
  }

  .sidebar-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;
    cursor: pointer;
  }

  .logo-dot {
    width: 28px; height: 28px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    border-radius: 8px;
    flex-shrink: 0;
  }

  .sidebar-logo span {
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 0.01em;
  }

  .new-chat-btn {
    width: 100%;
    padding: 9px 14px;
    background: var(--accent-glow);
    border: 1px solid var(--accent);
    border-radius: 9px;
    color: var(--accent);
    font-family: 'Sora', sans-serif;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .new-chat-btn:hover { background: rgba(91,138,245,0.28); }

  .sidebar-section {
    padding: 14px 16px 6px;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .history-list {
    flex: 1;
    overflow-y: auto;
    padding: 0 10px 16px;
  }

  .history-list::-webkit-scrollbar { width: 4px; }
  .history-list::-webkit-scrollbar-track { background: transparent; }
  .history-list::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

  .history-item {
    padding: 10px 12px;
    border-radius: 9px;
    cursor: pointer;
    transition: background 0.15s;
    margin-bottom: 2px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .history-item:hover { background: var(--surface); }
  .history-item.active { background: var(--surface2); }

  .history-icon {
    font-size: 14px;
    flex-shrink: 0;
  }

  .history-text { overflow: hidden; }

  .history-title {
    font-size: 13px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .history-meta {
    font-size: 11px;
    color: var(--text-muted);
    margin-top: 2px;
  }

  .sidebar-footer {
    padding: 14px 16px;
    border-top: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .avatar-sm {
    width: 32px; height: 32px;
    border-radius: 50%;
    object-fit: cover;
  }

  .user-info { flex: 1; overflow: hidden; }

  .user-info .name {
    font-size: 13px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .user-info .role {
    font-size: 11px;
    color: var(--text-muted);
  }

  /* ── Main Chat ── */
  .chat-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: var(--bg);
    position: relative;
  }

  .chat-topbar {
    padding: 16px 28px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(13,15,20,0.8);
    backdrop-filter: blur(12px);
    flex-shrink: 0;
  }

  .topbar-left { display: flex; align-items: center; gap: 12px; }

  .session-tag {
    background: var(--surface2);
    border: 1px solid var(--border);
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    color: var(--text-muted);
    font-family: 'JetBrains Mono', monospace;
  }

  .resume-tag {
    background: var(--accent-glow);
    border: 1px solid var(--accent);
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    color: var(--accent);
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .topbar-title {
    font-size: 15px;
    font-weight: 600;
  }

  /* Messages */
  .messages-area {
    flex: 1;
    overflow-y: auto;
    padding: 28px 32px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    scroll-behavior: smooth;
  }

  .messages-area::-webkit-scrollbar { width: 5px; }
  .messages-area::-webkit-scrollbar-track { background: transparent; }
  .messages-area::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

  .msg-row {
    display: flex;
    gap: 12px;
    animation: fadeUp 0.3s ease both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .msg-row.user { flex-direction: row-reverse; }

  .msg-avatar {
    width: 34px; height: 34px;
    border-radius: 50%;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    background: var(--surface2);
    object-fit: cover;
  }

  .ai-avatar-icon {
    width: 34px; height: 34px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    flex-shrink: 0;
  }

  .bubble {
    max-width: 68%;
    padding: 13px 17px;
    border-radius: var(--radius);
    font-size: 14px;
    line-height: 1.65;
    word-break: break-word;
  }

  .bubble.ai {
    background: var(--ai-bubble);
    border: 1px solid var(--border);
    border-top-left-radius: 4px;
  }

  .bubble.user {
    background: var(--user-bubble);
    border: 1px solid rgba(91,138,245,0.3);
    border-top-right-radius: 4px;
  }

  .bubble-time {
    font-size: 10px;
    color: var(--text-muted);
    margin-top: 5px;
    font-family: 'JetBrains Mono', monospace;
  }

  .msg-row.user .bubble-time { text-align: right; }

  .typing-indicator {
    display: flex;
    gap: 5px;
    align-items: center;
    padding: 6px 0;
  }

  .typing-indicator span {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: var(--text-muted);
    animation: bounce 1.1s infinite;
  }
  .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
  .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

  @keyframes bounce {
    0%,60%,100% { transform: translateY(0); }
    30% { transform: translateY(-6px); }
  }

  /* Input */
  .chat-input-area {
    padding: 18px 28px 22px;
    border-top: 1px solid var(--border);
    background: var(--bg);
    flex-shrink: 0;
  }

  .input-wrapper {
    display: flex;
    align-items: flex-end;
    gap: 10px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 10px 14px;
    transition: border-color 0.2s;
  }

  .input-wrapper:focus-within {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px var(--accent-glow);
  }

  .chat-textarea {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: var(--text);
    font-family: 'Sora', sans-serif;
    font-size: 14px;
    resize: none;
    max-height: 120px;
    min-height: 24px;
    line-height: 1.5;
  }

  .chat-textarea::placeholder { color: var(--text-muted); }

  .send-btn {
    width: 36px; height: 36px;
    border-radius: 9px;
    border: none;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    flex-shrink: 0;
    transition: opacity 0.2s, transform 0.15s;
  }

  .send-btn:hover { opacity: 0.85; transform: scale(1.06); }
  .send-btn:disabled { opacity: 0.35; cursor: not-allowed; transform: none; }

  .input-hint {
    font-size: 11px;
    color: var(--text-muted);
    margin-top: 8px;
    text-align: center;
  }

  /* Empty state */
  .empty-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    padding: 40px;
    text-align: center;
  }

  .empty-icon {
    width: 60px; height: 60px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    border-radius: 18px;
    display: flex; align-items: center; justify-content: center;
    font-size: 28px;
  }

  .empty-state h3 { font-size: 18px; font-weight: 600; }
  .empty-state p { font-size: 13px; color: var(--text-muted); max-width: 340px; line-height: 1.6; }

  .suggestion-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: center;
    margin-top: 6px;
  }

  .chip {
    padding: 7px 14px;
    border-radius: 20px;
    border: 1px solid var(--border);
    background: var(--surface);
    font-size: 12px;
    color: var(--text-muted);
    cursor: pointer;
    transition: border-color 0.15s, color 0.15s;
    font-family: 'Sora', sans-serif;
  }

  .chip:hover { border-color: var(--accent); color: var(--accent); }
`;

const HISTORY = [
  { id: 1, icon: "💼", title: "Frontend Developer Interview", meta: "Today · 12 msgs", active: true },
  { id: 2, icon: "⚛️", title: "React Deep Dive Session", meta: "Yesterday · 8 msgs" },
  { id: 3, icon: "🧠", title: "JavaScript Concepts", meta: "May 25 · 15 msgs" },
  { id: 4, icon: "🏗️", title: "System Design Prep", meta: "May 20 · 6 msgs" },
  { id: 5, icon: "📝", title: "Resume Review", meta: "May 18 · 4 msgs" },
];

const SUGGESTIONS = [
  "Walk me through your resume",
  "What are your strengths?",
  "Explain a challenging project",
  "Why this role?",
];

const now = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const ChatScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const fileName = location.state?.fileName || null;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [activeHistory, setActiveHistory] = useState(1);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, typing]);

  const sendMessage = async (text) => {
    const content = text || input.trim();
    if (!content) return;

    const userMsg = { role: "user", content, time: now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Great point! Let me ask you a follow-up — can you describe a specific situation where you had to handle conflicting priorities at work?",
        "That's a solid answer. Interviewers love concrete examples with measurable outcomes. Could you quantify the impact of what you did?",
        "Interesting! Tell me more about the technical decisions you made in that project and why you chose that particular approach.",
        "Good. Now let's shift gears — how do you keep up with the latest trends in frontend development?",
      ];
      const aiMsg = {
        role: "ai",
        content: responses[Math.floor(Math.random() * responses.length)],
        time: now(),
      };
      setTyping(false);
      setMessages((prev) => [...prev, aiMsg]);
    }, 1400 + Math.random() * 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleTextareaInput = (e) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  const isEmpty = messages.length === 0 && !typing;

  return (
    <>
      <style>{styles}</style>
      <div className="chat-root">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <div className="sidebar-logo" onClick={() => navigate("/dashboard")}>
              <div className="logo-dot" />
              <span>InterviewAI</span>
            </div>
            <button className="new-chat-btn" onClick={() => setMessages([])}>
              <span>✦</span> New Session
            </button>
          </div>

          <div className="sidebar-section">Recent Sessions</div>

          <div className="history-list">
            {HISTORY.map((item) => (
              <div
                key={item.id}
                className={`history-item ${activeHistory === item.id ? "active" : ""}`}
                onClick={() => setActiveHistory(item.id)}
              >
                <span className="history-icon">{item.icon}</span>
                <div className="history-text">
                  <div className="history-title">{item.title}</div>
                  <div className="history-meta">{item.meta}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="sidebar-footer">
            <img
              className="avatar-sm"
              src="https://i.pravatar.cc/150?img=3"
              alt="User"
            />
            <div className="user-info">
              <div className="name">Shivaram</div>
              <div className="role">Candidate</div>
            </div>
          </div>
        </aside>

        {/* Main Chat */}
        <main className="chat-main">
          {/* Topbar */}
          <div className="chat-topbar">
            <div className="topbar-left">
              <span className="topbar-title">Interview Session</span>
              {fileName && (
                <span className="resume-tag" title={fileName}>📄 {fileName}</span>
              )}
            </div>
            <span className="session-tag">
              {messages.length} msg{messages.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Messages */}
          {isEmpty ? (
            <div className="empty-state">
              <div className="empty-icon">🎯</div>
              <h3>Ready when you are</h3>
              <p>
                {fileName
                  ? `Your resume "${fileName}" has been loaded. Ask me anything or pick a suggestion below.`
                  : "Start a conversation with your AI interviewer. Ask a question or pick a suggestion."}
              </p>
              <div className="suggestion-chips">
                {SUGGESTIONS.map((s) => (
                  <button key={s} className="chip" onClick={() => sendMessage(s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="messages-area">
              {messages.map((msg, i) => (
                <div key={i} className={`msg-row ${msg.role}`}>
                  {msg.role === "ai" ? (
                    <div className="ai-avatar-icon">✦</div>
                  ) : (
                    <img
                      className="msg-avatar"
                      src="https://i.pravatar.cc/150?img=3"
                      alt="User"
                    />
                  )}
                  <div>
                    <div className={`bubble ${msg.role}`}>{msg.content}</div>
                    <div className="bubble-time">{msg.time}</div>
                  </div>
                </div>
              ))}

              {typing && (
                <div className="msg-row ai">
                  <div className="ai-avatar-icon">✦</div>
                  <div className="bubble ai">
                    <div className="typing-indicator">
                      <span /><span /><span />
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}

          {/* Input */}
          <div className="chat-input-area">
            <div className="input-wrapper">
              <textarea
                ref={textareaRef}
                className="chat-textarea"
                rows={1}
                placeholder="Type your answer or question…"
                value={input}
                onChange={handleTextareaInput}
                onKeyDown={handleKeyDown}
              />
              <button
                className="send-btn"
                onClick={() => sendMessage()}
                disabled={!input.trim() || typing}
                title="Send"
              >
                ↑
              </button>
            </div>
            <div className="input-hint">Press Enter to send · Shift+Enter for new line</div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ChatScreen;