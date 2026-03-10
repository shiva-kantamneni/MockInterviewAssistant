import React, { useState, useRef, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const BASE_URL    = "http://localhost:5000/interview";
const HISTORY_URL = "http://localhost:5000/history";

const authHeader = () => {
  const t = localStorage.getItem("token");
  return t ? { Authorization: `Bearer ${t}` } : {};
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0d0f14;
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
    --rec: #ff4757;
    --rec-glow: rgba(255,71,87,0.22);
    --green: #22c55e;
    --green-glow: rgba(34,197,94,0.15);
    --tts: #a78bfa;
    --tts-glow: rgba(167,139,250,0.18);
  }

  .chat-root { display: flex; flex-direction: column; height: 100vh; background: var(--bg); font-family: 'Sora', sans-serif; color: var(--text); overflow: hidden; }

  /* Top bar */
  .chat-topbar { padding: 14px 28px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; background: rgba(13,15,20,0.85); backdrop-filter: blur(12px); flex-shrink: 0; }
  .topbar-left { display: flex; align-items: center; gap: 12px; }
  .topbar-back { display: flex; align-items: center; gap: 7px; padding: 6px 14px; border-radius: 20px; border: 1px solid var(--border); background: transparent; color: var(--text-muted); font-size: 13px; font-family: 'Sora', sans-serif; cursor: pointer; transition: all 0.18s; }
  .topbar-back:hover { border-color: var(--accent); color: var(--accent); background: var(--accent-glow); }
  .logo-dot { width: 26px; height: 26px; border-radius: 7px; background: linear-gradient(135deg, var(--accent), var(--accent2)); flex-shrink: 0; }
  .topbar-title { font-size: 15px; font-weight: 600; }
  .session-tag { background: var(--surface2); border: 1px solid var(--border); padding: 4px 12px; border-radius: 20px; font-size: 12px; color: var(--text-muted); font-family: 'JetBrains Mono', monospace; }
  .resume-tag { background: var(--accent-glow); border: 1px solid var(--accent); padding: 4px 12px; border-radius: 20px; font-size: 12px; color: var(--accent); max-width: 220px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .topic-tag { background: rgba(167,139,250,0.12); border: 1px solid rgba(167,139,250,0.35); padding: 4px 12px; border-radius: 20px; font-size: 12px; color: #a78bfa; max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

  /* Messages */
  .messages-area { flex: 1; overflow-y: auto; padding: 28px 28px; display: flex; flex-direction: column; gap: 20px; scroll-behavior: smooth; max-width: 860px; width: 100%; margin: 0 auto; align-self: center; }
  .messages-area::-webkit-scrollbar { width: 5px; }
  .messages-area::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

  .msg-row { display: flex; gap: 12px; animation: fadeUp 0.3s ease both; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .msg-row.user { flex-direction: row-reverse; }
  .ai-avatar-icon { width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0; background: linear-gradient(135deg, var(--accent), var(--accent2)); display: flex; align-items: center; justify-content: center; font-size: 15px; }
  .user-avatar-letter { width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0; background: linear-gradient(135deg, #6366f1, #8b5cf6); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; color: white; font-family: 'Sora', sans-serif; }
  .bubble { max-width: 72%; padding: 13px 17px; border-radius: var(--radius); font-size: 14px; line-height: 1.65; word-break: break-word; }
  .bubble.ai { background: var(--ai-bubble); border: 1px solid var(--border); border-top-left-radius: 4px; }
  .bubble.user { background: var(--user-bubble); border: 1px solid rgba(91,138,245,0.3); border-top-right-radius: 4px; }
  .bubble-time { font-size: 10px; color: var(--text-muted); margin-top: 5px; font-family: 'JetBrains Mono', monospace; }
  .msg-row.user .bubble-time { text-align: right; }

  /* TTS */
  .tts-btn { display: inline-flex; align-items: center; gap: 6px; padding: 5px 13px; border-radius: 20px; font-size: 12px; font-weight: 500; cursor: pointer; border: 1px solid var(--tts); font-family: 'Sora', sans-serif; transition: all 0.2s; background: var(--tts-glow); color: var(--tts); margin-top: 8px; }
  .tts-btn:hover { background: rgba(167,139,250,0.3); transform: scale(1.02); }
  .tts-btn.speaking { background: rgba(167,139,250,0.25); animation: tts-pulse 1.5s ease-in-out infinite; }
  @keyframes tts-pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(167,139,250,0.4); } 50% { box-shadow: 0 0 0 6px rgba(167,139,250,0); } }
  .tts-bars { display: flex; align-items: center; gap: 2px; height: 14px; }
  .tts-bars span { display: inline-block; width: 3px; background: var(--tts); border-radius: 2px; animation: bar-bounce 0.6s ease-in-out infinite alternate; }
  .tts-bars span:nth-child(1){height:6px;animation-delay:0s} .tts-bars span:nth-child(2){height:12px;animation-delay:.15s} .tts-bars span:nth-child(3){height:8px;animation-delay:.3s} .tts-bars span:nth-child(4){height:14px;animation-delay:.1s} .tts-bars span:nth-child(5){height:5px;animation-delay:.25s}
  @keyframes bar-bounce { from{transform:scaleY(0.4)} to{transform:scaleY(1)} }

  /* Recording */
  .rec-controls { display: flex; align-items: center; gap: 8px; margin-top: 8px; flex-wrap: wrap; }
  .rec-btn { display: flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 20px; font-family: 'Sora', sans-serif; font-size: 12px; font-weight: 500; cursor: pointer; border: none; transition: all 0.2s; }
  .rec-btn.start { background: var(--rec-glow); border: 1px solid var(--rec); color: var(--rec); }
  .rec-btn.start:hover { background: rgba(255,71,87,0.32); }
  .rec-btn.stop { background: var(--rec); color: white; animation: pulse-rec 1.4s infinite; }
  @keyframes pulse-rec { 0%,100%{box-shadow:0 0 0 0 var(--rec-glow)} 50%{box-shadow:0 0 0 6px transparent} }
  .rec-btn.send { background: linear-gradient(135deg, var(--green), #16a34a); color: white; border: none; }
  .rec-btn.send:hover { opacity: 0.88; }
  .rec-dot { width: 8px; height: 8px; border-radius: 50%; background: currentColor; animation: blink 1s infinite; display: inline-block; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
  .rec-timer { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--rec); }
  .rec-badge { display: flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 20px; background: rgba(80,200,120,0.12); border: 1px solid rgba(80,200,120,0.4); color: #50c878; font-size: 11px; font-weight: 500; }
  .perm-error { font-size: 11px; color: var(--rec); margin-top: 4px; display: block; }
  .audio-visualizer { display: flex; align-items: center; gap: 2px; height: 24px; padding: 0 4px; }
  .audio-visualizer span { display: inline-block; width: 3px; background: var(--rec); border-radius: 2px; animation: wave 0.8s ease-in-out infinite alternate; }
  .audio-visualizer span:nth-child(1){height:6px;animation-delay:0s} .audio-visualizer span:nth-child(2){height:14px;animation-delay:.1s} .audio-visualizer span:nth-child(3){height:20px;animation-delay:.2s} .audio-visualizer span:nth-child(4){height:10px;animation-delay:.15s} .audio-visualizer span:nth-child(5){height:18px;animation-delay:.05s} .audio-visualizer span:nth-child(6){height:8px;animation-delay:.25s}
  @keyframes wave { from{transform:scaleY(0.3)} to{transform:scaleY(1)} }
  audio { height: 32px; border-radius: 20px; outline: none; max-width: 220px; }
  .send-pill { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 500; }
  .send-pill.uploading { background: var(--accent-glow); border: 1px solid var(--accent); color: var(--accent); }
  .send-pill.success { background: var(--green-glow); border: 1px solid rgba(34,197,94,0.4); color: var(--green); }
  .spin { display: inline-block; animation: spin 0.85s linear infinite; }
  @keyframes spin { to{transform:rotate(360deg)} }

  /* Typing */
  .typing-indicator { display: flex; gap: 5px; align-items: center; padding: 6px 0; }
  .typing-indicator span { width: 7px; height: 7px; border-radius: 50%; background: var(--text-muted); animation: bounce 1.1s infinite; }
  .typing-indicator span:nth-child(2){animation-delay:.2s} .typing-indicator span:nth-child(3){animation-delay:.4s}
  @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-6px)} }

  /* Input */
  .chat-input-area { padding: 16px 28px 22px; border-top: 1px solid var(--border); background: var(--bg); flex-shrink: 0; }
  .input-inner { max-width: 860px; margin: 0 auto; }
  .input-wrapper { display: flex; align-items: flex-end; gap: 10px; background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 10px 14px; transition: border-color 0.2s; }
  .input-wrapper:focus-within { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-glow); }
  .chat-textarea { flex: 1; background: transparent; border: none; outline: none; color: var(--text); font-family: 'Sora', sans-serif; font-size: 14px; resize: none; max-height: 120px; min-height: 24px; line-height: 1.5; }
  .chat-textarea::placeholder { color: var(--text-muted); }
  .send-btn { width: 36px; height: 36px; border-radius: 9px; border: none; flex-shrink: 0; background: linear-gradient(135deg, var(--accent), var(--accent2)); color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px; transition: opacity 0.2s, transform 0.15s; }
  .send-btn:hover { opacity: 0.85; transform: scale(1.06); }
  .send-btn:disabled { opacity: 0.35; cursor: not-allowed; transform: none; }
  .input-hint { font-size: 11px; color: var(--text-muted); margin-top: 8px; text-align: center; }

  /* Empty */
  .empty-state { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; padding: 40px; text-align: center; }
  .empty-icon { width: 60px; height: 60px; background: linear-gradient(135deg, var(--accent), var(--accent2)); border-radius: 18px; display: flex; align-items: center; justify-content: center; font-size: 28px; }
  .empty-state h3 { font-size: 18px; font-weight: 600; }
  .empty-state p { font-size: 13px; color: var(--text-muted); max-width: 340px; line-height: 1.6; }
  .suggestion-chips { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-top: 6px; }
  .chip { padding: 7px 14px; border-radius: 20px; border: 1px solid var(--border); background: var(--surface); font-size: 12px; color: var(--text-muted); cursor: pointer; transition: border-color 0.15s, color 0.15s; font-family: 'Sora', sans-serif; }
  .chip:hover { border-color: var(--accent); color: var(--accent); }
`;

const SUGGESTIONS = ["Walk me through your resume","What are your strengths?","Explain a challenging project","Why this role?"];
const nowStr = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
const formatTimer = (s) => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
const getAudioMime = () => {
  const types = ["audio/webm;codecs=opus","audio/webm","audio/ogg;codecs=opus","audio/mp4"];
  return types.find((t) => MediaRecorder.isTypeSupported(t)) || "audio/webm";
};

// ── TTS ───────────────────────────────────────────────────────────────────────
function useTTS() {
  const [speakingId, setSpeakingId] = useState(null);
  const speak = useCallback((text, id) => {
    window.speechSynthesis.cancel();
    if (speakingId === id) { setSpeakingId(null); return; }
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.92; u.pitch = 1.05; u.volume = 1;
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.lang==="en-US" && (v.name.includes("Google")||v.name.includes("Natural"))) || voices.find(v=>v.lang==="en-US") || voices[0];
    if (preferred) u.voice = preferred;
    u.onstart = () => setSpeakingId(id);
    u.onend   = () => setSpeakingId(null);
    u.onerror = () => setSpeakingId(null);
    window.speechSynthesis.speak(u);
  }, [speakingId]);
  useEffect(() => () => window.speechSynthesis.cancel(), []);
  return { speakingId, speak };
}

function ListenButton({ text, msgId, speakingId, onSpeak }) {
  const isSpeaking = speakingId === msgId;
  return (
    <button className={`tts-btn ${isSpeaking?"speaking":""}`} onClick={() => onSpeak(text, msgId)}>
      {isSpeaking ? <><div className="tts-bars"><span/><span/><span/><span/><span/></div>Stop</> : <><span>🔊</span>Listen</>}
    </button>
  );
}

// ── Audio Recorder ────────────────────────────────────────────────────────────
function useAudioRecorder() {
  const [recState,    setRecState]    = useState("idle");
  const [blobUrl,     setBlobUrl]     = useState(null);
  const [blobRef,     setBlobRef]     = useState(null);
  const [elapsed,     setElapsed]     = useState(0);
  const [recError,    setRecError]    = useState(null);
  const [uploadState, setUploadState] = useState("idle");
  const [uploadPct,   setUploadPct]   = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const mrRef = useRef(null); const chunks = useRef([]); const timerRef = useRef(null);

  const start = useCallback(async () => {
    setRecError(null); setUploadState("idle"); setUploadPct(0);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      const mr = new MediaRecorder(stream, { mimeType: getAudioMime() });
      mrRef.current = mr; chunks.current = [];
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunks.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(chunks.current, { type: getAudioMime() });
        setBlobRef(blob); setBlobUrl(URL.createObjectURL(blob)); setRecState("done");
        stream.getTracks().forEach(t => t.stop());
      };
      mr.start(200); setRecState("recording"); setElapsed(0);
      timerRef.current = setInterval(() => setElapsed(p => p+1), 1000);
    } catch { setRecError("Microphone permission denied. Please allow access and try again."); }
  }, []);

  const stop  = useCallback(() => { clearInterval(timerRef.current); mrRef.current?.stop(); }, []);
  const reset = useCallback(() => {
    if (blobUrl) URL.revokeObjectURL(blobUrl);
    setBlobUrl(null); setBlobRef(null); setRecState("idle"); setElapsed(0);
    setRecError(null); setUploadState("idle"); setUploadPct(0); setUploadError(null);
  }, [blobUrl]);

  const upload = useCallback(async (questionText, msgIndex, onResult) => {
    if (!blobRef) return;
    setUploadState("uploading"); setUploadPct(0); setUploadError(null);
    const ext = blobRef.type.includes("ogg") ? "ogg" : blobRef.type.includes("mp4") ? "mp4" : "webm";
    const fd = new FormData();
    fd.append("audio", blobRef, `answer-q${msgIndex+1}.${ext}`);
    fd.append("question", questionText);
    fd.append("questionIndex", String(msgIndex));
    fd.append("timestamp", new Date().toISOString());
    try {
      const res = await axios.post(`${BASE_URL}/upload-answer`, fd, {
        headers: authHeader(), timeout: 300000,
        onUploadProgress: (e) => { if (e.total) setUploadPct(Math.round(e.loaded*100/e.total)); },
      });
      setUploadPct(100); setUploadState("success");
      if (onResult) onResult(res.data);
    } catch (err) {
      setUploadError(err.response?.data?.error || err.message || "Upload failed");
      setUploadState("failed");
    }
  }, [blobRef]);

  return { recState, blobUrl, elapsed, recError, uploadState, uploadPct, uploadError, start, stop, reset, upload };
}

function AudioRecordingControls({ msgIndex, questionText, onAnswer }) {
  const rec = useAudioRecorder();
  return (
    <div className="rec-controls">
      {rec.recState === "idle" && <button className="rec-btn start" onClick={rec.start}><span className="rec-dot" style={{background:"var(--rec)"}}/> Record Answer</button>}
      {rec.recState === "recording" && (<><div className="audio-visualizer"><span/><span/><span/><span/><span/><span/></div><button className="rec-btn stop" onClick={rec.stop}>■ Stop</button><span className="rec-timer"><span className="rec-dot" style={{marginRight:5}}/>{formatTimer(rec.elapsed)}</span></>)}
      {rec.recState === "done" && (<>
        <span className="rec-badge">🎙 {formatTimer(rec.elapsed)}</span>
        <audio src={rec.blobUrl} controls />
        {rec.uploadState === "idle"      && <button className="rec-btn send" onClick={() => rec.upload(questionText, msgIndex, onAnswer)}>⬆ Send Answer</button>}
        {rec.uploadState === "uploading" && <span className="send-pill uploading"><span className="spin">⟳</span> {rec.uploadPct}%</span>}
        {rec.uploadState === "success"   && <span className="send-pill success">✓ Answer sent</span>}
        {rec.uploadState === "failed"    && <button className="rec-btn send" onClick={() => rec.upload(questionText, msgIndex, onAnswer)}>↺ Retry</button>}
        {rec.uploadState !== "success"   && <button className="rec-btn start" onClick={rec.reset}>↺ Re-record</button>}
      </>)}
      {rec.recError && <span className="perm-error">⚠ {rec.recError}</span>}
      {rec.uploadState === "failed" && rec.uploadError && <span className="perm-error">✕ {rec.uploadError}</span>}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
const ChatScreen = () => {
  const location   = useLocation();
  const navigate   = useNavigate();

  // ── Source A: resume-based interview (from Dashboard PDF upload) ──────────
  const fileName   = location.state?.fileName   || null;
  const resumeText = location.state?.resumeText || "";

  // ── Source B: topic/role-based interview (from StartInterviewForm) ────────
  const topic          = location.state?.topic          || "";
  const role           = location.state?.role           || "";
  const customQuestion = location.state?.customQuestion || "";

  // Determine interview mode
  const isTopicMode  = !resumeText && (topic || role);
  const isResumeMode = !!resumeText;

  const [messages,      setMessages]      = useState([]);
  const [input,         setInput]         = useState("");
  const [typing,        setTyping]        = useState(false);
  const [activeSession, setActiveSession] = useState(null);
  const [userInitial,   setUserInitial]   = useState("U");

  const { speakingId, speak } = useTTS();
  const bottomRef   = useRef(null);
  const textareaRef = useRef(null);
  const resumeRef   = useRef(resumeText);
  const saveTimer   = useRef(null);

  // Interview context ref — sent with every chat call
  const interviewContextRef = useRef({ topic, role, customQuestion, resumeText });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/"); return; }
    try {
      const decoded = jwtDecode(token);
      const name = decoded.name || decoded.email || "U";
      setUserInitial(name.charAt(0).toUpperCase());
    } catch { navigate("/"); }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  // ── Session helpers ───────────────────────────────────────────────────────
  const sessionLabel = fileName || (topic ? `${role} · ${topic}` : "");

  const createSession = useCallback(async (msgs) => {
    try {
      const res = await axios.post(
        `${HISTORY_URL}/sessions`,
        { messages: msgs, fileName: sessionLabel },
        { headers: authHeader() }
      );
      const id = res.data.sessionId;
      setActiveSession(id);
      return id;
    } catch { return null; }
  }, [sessionLabel]);

  const autoSave = useCallback((msgs, sessionId) => {
    if (!sessionId) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        await axios.patch(
          `${HISTORY_URL}/sessions/${sessionId}`,
          { messages: msgs, fileName: sessionLabel },
          { headers: authHeader() }
        );
      } catch (err) {
        console.error("Auto-save failed:", err.response?.data || err.message);
      }
    }, 1500);
  }, [sessionLabel]);

  // ── Init: resume mode ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!isResumeMode) return;
    setTyping(true);
    axios.post(`${BASE_URL}/process-resume`, { resumeText })
      .then((res) => {
        const firstMsg = { role: "ai", content: res.data.questions[0], time: nowStr() };
        setMessages([firstMsg]);
        createSession([firstMsg]);
      })
      .catch(() => {
        const fallback = { role: "ai", content: "Hi! I'm ready for your interview. Tell me about yourself.", time: nowStr() };
        setMessages([fallback]);
        createSession([fallback]);
      })
      .finally(() => setTyping(false));
  }, []); // eslint-disable-line

  // ── Init: topic/role mode ─────────────────────────────────────────────────
  useEffect(() => {
    if (!isTopicMode) return;
    setTyping(true);
    axios.post(`${BASE_URL}/start-interview`, { topic, role, customQuestion })
      .then((res) => {
        const firstMsg = { role: "ai", content: res.data.question, time: nowStr() };
        setMessages([firstMsg]);
        createSession([firstMsg]);
      })
      .catch(() => {
        const fallback = {
          role: "ai",
          content: `Hi! I'll be interviewing you for the ${role || "role"} position${topic ? ` with a focus on ${topic}` : ""}. Let's begin — tell me about yourself.`,
          time: nowStr()
        };
        setMessages([fallback]);
        createSession([fallback]);
      })
      .finally(() => setTyping(false));
  }, []); // eslint-disable-line

  // ── Send message ──────────────────────────────────────────────────────────
  const sendMessage = async (text) => {
    const content = text || input.trim();
    if (!content) return;
    const userMsg = { role: "user", content, time: nowStr() };
    const nextMsgs = [...messages, userMsg];
    setMessages(nextMsgs);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setTyping(true);

    let sessId = activeSession;
    if (!sessId) sessId = await createSession(nextMsgs);

    try {
      const ctx = interviewContextRef.current;
      const res = await axios.post(`${BASE_URL}/chat`, {
        userMessage: content,
        conversationHistory: messages,
        // Always send all available context so the backend can tailor responses
        resumeText: ctx.resumeText,
        topic:      ctx.topic,
        role:       ctx.role,
        customQuestion: ctx.customQuestion,
      });
      const aiMsg = { role: "ai", content: res.data.reply, time: nowStr() };
      const updated = [...nextMsgs, aiMsg];
      setMessages(updated);
      autoSave(updated, sessId);
    } catch {
      const errMsg = { role: "ai", content: "Sorry, I couldn't connect to the server. Please try again.", time: nowStr() };
      const updated = [...nextMsgs, errMsg];
      setMessages(updated);
      autoSave(updated, sessId);
    } finally { setTyping(false); }
  };

  const handleAnswer = useCallback((data) => {
    setMessages((prev) => {
      const updated = [...prev,
        { role: "user", content: data.transcript, time: nowStr() },
        { role: "ai",   content: data.aiResponse,  time: nowStr() }
      ];
      autoSave(updated, activeSession);
      return updated;
    });
  }, [activeSession, autoSave]);

  const handleKeyDown = (e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } };
  const handleTextareaInput = (e) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  const isEmpty = messages.length === 0 && !typing;

  // Topbar context label
  const topbarTag = fileName
    ? <span className="resume-tag" title={fileName}>📄 {fileName}</span>
    : topic
      ? <span className="topic-tag">🎯 {role}{topic ? ` · ${topic}` : ""}</span>
      : null;

  return (
    <>
      <style>{styles}</style>
      <div className="chat-root">

        {/* Top bar */}
        <div className="chat-topbar">
          <div className="topbar-left">
            <button className="topbar-back" onClick={() => navigate("/dashboard")}>← Dashboard</button>
            <div className="logo-dot" />
            <span className="topbar-title">Interview Session</span>
            {topbarTag}
          </div>
          <span className="session-tag">{messages.length} msg{messages.length !== 1 ? "s" : ""}</span>
        </div>

        {/* Messages */}
        {isEmpty ? (
          <div className="empty-state">
            <div className="empty-icon">🎯</div>
            <h3>Ready when you are</h3>
            <p>
              {fileName
                ? `Your resume "${fileName}" has been loaded. The interview will begin shortly.`
                : isTopicMode
                  ? `Preparing your ${role || "interview"} session${topic ? ` on ${topic}` : ""}…`
                  : "Start a conversation with your AI interviewer."}
            </p>
            {!isResumeMode && !isTopicMode && (
              <div className="suggestion-chips">
                {SUGGESTIONS.map(s => <button key={s} className="chip" onClick={() => sendMessage(s)}>{s}</button>)}
              </div>
            )}
          </div>
        ) : (
          <div className="messages-area">
            {messages.map((msg, i) => (
              <div key={i} className={`msg-row ${msg.role}`}>
                {msg.role === "ai"
                  ? <div className="ai-avatar-icon">✦</div>
                  : <div className="user-avatar-letter">{userInitial}</div>
                }
                <div style={{ maxWidth: "72%" }}>
                  <div className={`bubble ${msg.role}`}>{msg.content}</div>
                  <div className="bubble-time">{msg.time}</div>
                  {msg.role === "ai" && (
                    <>
                      <ListenButton text={msg.content} msgId={i} speakingId={speakingId} onSpeak={speak} />
                      <AudioRecordingControls msgIndex={i} questionText={msg.content} onAnswer={handleAnswer} />
                    </>
                  )}
                </div>
              </div>
            ))}
            {typing && (
              <div className="msg-row ai">
                <div className="ai-avatar-icon">✦</div>
                <div className="bubble ai"><div className="typing-indicator"><span/><span/><span/></div></div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}

        {/* Input */}
        <div className="chat-input-area">
          <div className="input-inner">
            <div className="input-wrapper">
              <textarea ref={textareaRef} className="chat-textarea" rows={1} placeholder="Type your answer or question…" value={input} onChange={handleTextareaInput} onKeyDown={handleKeyDown} />
              <button className="send-btn" onClick={() => sendMessage()} disabled={!input.trim() || typing}>↑</button>
            </div>
            <div className="input-hint">Press Enter to send · Shift+Enter for new line</div>
          </div>
        </div>

      </div>
    </>
  );
};

export default ChatScreen;