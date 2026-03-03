import React, { useState, useRef, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// ─── Change this to your actual backend endpoint ───────────────────────────
const UPLOAD_ENDPOINT = "/api/interview/upload-answer";
// ───────────────────────────────────────────────────────────────────────────

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
    --rec: #ff4757;
    --rec-glow: rgba(255,71,87,0.22);
    --green: #22c55e;
    --green-glow: rgba(34,197,94,0.15);
  }

  .chat-root {
    display: flex; height: 100vh; background: var(--bg);
    font-family: 'Sora', sans-serif; color: var(--text); overflow: hidden;
  }

  /* ── Sidebar ── */
  .sidebar {
    width: 25%; min-width: 220px; max-width: 300px;
    background: var(--sidebar-bg); border-right: 1px solid var(--border);
    display: flex; flex-direction: column; overflow: hidden;
  }
  .sidebar-header { padding: 22px 20px 16px; border-bottom: 1px solid var(--border); }
  .sidebar-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; cursor: pointer; }
  .logo-dot {
    width: 28px; height: 28px; flex-shrink: 0; border-radius: 8px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
  }
  .sidebar-logo span { font-size: 15px; font-weight: 600; letter-spacing: 0.01em; }
  .new-chat-btn {
    width: 100%; padding: 9px 14px; background: var(--accent-glow);
    border: 1px solid var(--accent); border-radius: 9px; color: var(--accent);
    font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 500;
    cursor: pointer; transition: background 0.2s; display: flex; align-items: center; gap: 8px;
  }
  .new-chat-btn:hover { background: rgba(91,138,245,0.28); }
  .sidebar-section {
    padding: 14px 16px 6px; font-size: 10px; font-weight: 600;
    letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-muted);
  }
  .history-list { flex: 1; overflow-y: auto; padding: 0 10px 16px; }
  .history-list::-webkit-scrollbar { width: 4px; }
  .history-list::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
  .history-item {
    padding: 10px 12px; border-radius: 9px; cursor: pointer;
    transition: background 0.15s; margin-bottom: 2px;
    display: flex; align-items: center; gap: 10px;
  }
  .history-item:hover { background: var(--surface); }
  .history-item.active { background: var(--surface2); }
  .history-icon { font-size: 14px; flex-shrink: 0; }
  .history-text { overflow: hidden; }
  .history-title { font-size: 13px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .history-meta { font-size: 11px; color: var(--text-muted); margin-top: 2px; }
  .sidebar-footer {
    padding: 14px 16px; border-top: 1px solid var(--border);
    display: flex; align-items: center; gap: 10px;
  }
  .avatar-sm { width: 32px; height: 32px; border-radius: 50%; object-fit: cover; }
  .user-info { flex: 1; overflow: hidden; }
  .user-info .name { font-size: 13px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .user-info .role { font-size: 11px; color: var(--text-muted); }

  /* ── Main Chat ── */
  .chat-main { flex: 1; display: flex; flex-direction: column; overflow: hidden; background: var(--bg); position: relative; }
  .chat-topbar {
    padding: 16px 28px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    background: rgba(13,15,20,0.8); backdrop-filter: blur(12px); flex-shrink: 0;
  }
  .topbar-left { display: flex; align-items: center; gap: 12px; }
  .session-tag {
    background: var(--surface2); border: 1px solid var(--border);
    padding: 4px 12px; border-radius: 20px; font-size: 12px;
    color: var(--text-muted); font-family: 'JetBrains Mono', monospace;
  }
  .resume-tag {
    background: var(--accent-glow); border: 1px solid var(--accent);
    padding: 4px 12px; border-radius: 20px; font-size: 12px; color: var(--accent);
    max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .topbar-title { font-size: 15px; font-weight: 600; }

  /* Messages */
  .messages-area {
    flex: 1; overflow-y: auto; padding: 28px 32px;
    display: flex; flex-direction: column; gap: 20px; scroll-behavior: smooth;
  }
  .messages-area::-webkit-scrollbar { width: 5px; }
  .messages-area::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
  .msg-row { display: flex; gap: 12px; animation: fadeUp 0.3s ease both; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .msg-row.user { flex-direction: row-reverse; }
  .msg-avatar {
    width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 15px; background: var(--surface2); object-fit: cover;
  }
  .ai-avatar-icon {
    width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    display: flex; align-items: center; justify-content: center; font-size: 15px;
  }
  .bubble {
    max-width: 68%; padding: 13px 17px; border-radius: var(--radius);
    font-size: 14px; line-height: 1.65; word-break: break-word;
  }
  .bubble.ai { background: var(--ai-bubble); border: 1px solid var(--border); border-top-left-radius: 4px; }
  .bubble.user { background: var(--user-bubble); border: 1px solid rgba(91,138,245,0.3); border-top-right-radius: 4px; }
  .bubble-time { font-size: 10px; color: var(--text-muted); margin-top: 5px; font-family: 'JetBrains Mono', monospace; }
  .msg-row.user .bubble-time { text-align: right; }

  /* ── Recording Controls ── */
  .rec-controls { display: flex; align-items: center; gap: 8px; margin-top: 8px; flex-wrap: wrap; }
  .rec-btn {
    display: flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 20px;
    font-family: 'Sora', sans-serif; font-size: 12px; font-weight: 500;
    cursor: pointer; border: none; transition: all 0.2s;
  }
  .rec-btn.start { background: var(--rec-glow); border: 1px solid var(--rec); color: var(--rec); }
  .rec-btn.start:hover { background: rgba(255,71,87,0.32); }
  .rec-btn.stop { background: var(--rec); color: white; animation: pulse-rec 1.4s infinite; }
  @keyframes pulse-rec { 0%,100% { box-shadow: 0 0 0 0 var(--rec-glow); } 50% { box-shadow: 0 0 0 6px transparent; } }
  .rec-btn.play { background: var(--accent-glow); border: 1px solid var(--accent); color: var(--accent); }
  .rec-btn.play:hover { background: rgba(91,138,245,0.3); }
  .rec-dot { width: 8px; height: 8px; border-radius: 50%; background: currentColor; animation: blink 1s infinite; display: inline-block; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} }
  .rec-timer { font-family: 'JetBrains Mono', monospace; font-size: 12px; color: var(--rec); }
  .rec-badge {
    display: flex; align-items: center; gap: 5px; padding: 4px 10px;
    border-radius: 20px; background: rgba(80,200,120,0.12);
    border: 1px solid rgba(80,200,120,0.4); color: #50c878;
    font-size: 11px; font-weight: 500;
  }
  .perm-error { font-size: 11px; color: var(--rec); }

  /* Inline upload status pills */
  .send-pill {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 500;
  }
  .send-pill.uploading { background: var(--accent-glow); border: 1px solid var(--accent); color: var(--accent); }
  .send-pill.success { background: var(--green-glow); border: 1px solid rgba(34,197,94,0.4); color: var(--green); }
  .send-pill.failed { background: var(--rec-glow); border: 1px solid var(--rec); color: var(--rec); }

  /* ── Modal ── */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.78);
    backdrop-filter: blur(8px); z-index: 2000;
    display: flex; align-items: center; justify-content: center;
    animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  .modal-box {
    background: var(--surface); border: 1px solid var(--border); border-radius: 18px;
    padding: 24px; width: 560px; max-width: 95vw;
    display: flex; flex-direction: column; gap: 16px;
    box-shadow: 0 24px 64px rgba(0,0,0,0.55);
    animation: slideUp 0.25s ease;
  }
  @keyframes slideUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  .modal-header { display: flex; align-items: center; justify-content: space-between; }
  .modal-title { font-size: 15px; font-weight: 600; }
  .modal-close {
    background: var(--surface2); border: 1px solid var(--border); color: var(--text-muted);
    border-radius: 8px; width: 30px; height: 30px; cursor: pointer; font-size: 16px;
    display: flex; align-items: center; justify-content: center; transition: color 0.15s;
  }
  .modal-close:hover { color: var(--text); }
  .modal-question {
    font-size: 12px; color: var(--text-muted); line-height: 1.6;
    padding: 10px 14px; background: var(--surface2); border-radius: 10px;
    border-left: 3px solid var(--accent);
  }
  .modal-question strong { color: var(--accent); font-size: 10px; display: block; margin-bottom: 4px; letter-spacing: 0.08em; }
  .modal-video { width: 100%; border-radius: 10px; background: #000; max-height: 290px; }

  /* Upload progress bar */
  .upload-progress { display: flex; flex-direction: column; gap: 6px; }
  .upload-bar-track { width: 100%; height: 5px; background: var(--surface2); border-radius: 99px; overflow: hidden; }
  .upload-bar-fill { height: 100%; background: linear-gradient(90deg, var(--accent), var(--green)); border-radius: 99px; transition: width 0.2s ease; }
  .upload-bar-labels { display: flex; justify-content: space-between; font-size: 11px; color: var(--text-muted); font-family: 'JetBrains Mono', monospace; }

  /* Upload notices */
  .upload-notice {
    font-size: 12px; padding: 8px 14px; border-radius: 9px;
    display: flex; align-items: center; gap: 8px;
  }
  .upload-notice.success { color: var(--green); background: var(--green-glow); border: 1px solid rgba(34,197,94,0.35); }
  .upload-notice.failed { color: var(--rec); background: var(--rec-glow); border: 1px solid var(--rec); }

  .modal-actions { display: flex; gap: 10px; justify-content: flex-end; flex-wrap: wrap; align-items: center; margin-top: 2px; }
  .modal-btn {
    padding: 9px 20px; border-radius: 9px; font-family: 'Sora', sans-serif;
    font-size: 13px; cursor: pointer; border: none; transition: opacity 0.2s;
    display: flex; align-items: center; gap: 7px; font-weight: 500;
  }
  .modal-btn.cancel { background: var(--surface2); border: 1px solid var(--border); color: var(--text-muted); font-weight: 400; }
  .modal-btn.cancel:hover { border-color: var(--text-muted); }
  .modal-btn.download { background: var(--accent); color: white; }
  .modal-btn.download:hover { opacity: 0.85; }
  .modal-btn.send-to-server { background: linear-gradient(135deg, var(--green), #16a34a); color: white; }
  .modal-btn.send-to-server:hover { opacity: 0.88; }
  .modal-btn.send-to-server:disabled { opacity: 0.45; cursor: not-allowed; }
  .modal-btn.sent-ok { background: var(--green-glow); border: 1px solid rgba(34,197,94,0.45); color: var(--green); cursor: default; }
  .modal-btn.send-err { background: var(--rec-glow); border: 1px solid var(--rec); color: var(--rec); }
  .modal-btn.send-err:hover { background: rgba(255,71,87,0.3); }

  /* Spin animation */
  .spin { display: inline-block; animation: spin 0.85s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Floating Cam Preview ── */
  .cam-preview {
    position: fixed; bottom: 110px; right: 28px; width: 220px;
    border-radius: 14px; overflow: hidden; border: 2px solid var(--rec);
    box-shadow: 0 0 24px var(--rec-glow), 0 8px 32px rgba(0,0,0,0.5);
    z-index: 1000; background: #000; animation: slideInCam 0.3s ease;
  }
  @keyframes slideInCam { from { opacity:0; transform: translateY(20px) scale(0.95); } to { opacity:1; transform: translateY(0) scale(1); } }
  .cam-preview video { width: 100%; display: block; transform: scaleX(-1); }
  .cam-label {
    position: absolute; top: 8px; left: 8px; display: flex; align-items: center; gap: 5px;
    background: rgba(0,0,0,0.65); backdrop-filter: blur(6px);
    padding: 3px 9px; border-radius: 20px; font-size: 11px;
    color: var(--rec); font-weight: 600; letter-spacing: 0.05em;
  }
  .cam-live-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--rec); animation: blink 1s infinite; }

  /* Typing */
  .typing-indicator { display: flex; gap: 5px; align-items: center; padding: 6px 0; }
  .typing-indicator span { width: 7px; height: 7px; border-radius: 50%; background: var(--text-muted); animation: bounce 1.1s infinite; }
  .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
  .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes bounce { 0%,60%,100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }

  /* Input */
  .chat-input-area { padding: 18px 28px 22px; border-top: 1px solid var(--border); background: var(--bg); flex-shrink: 0; }
  .input-wrapper {
    display: flex; align-items: flex-end; gap: 10px;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 14px; padding: 10px 14px; transition: border-color 0.2s;
  }
  .input-wrapper:focus-within { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-glow); }
  .chat-textarea {
    flex: 1; background: transparent; border: none; outline: none;
    color: var(--text); font-family: 'Sora', sans-serif; font-size: 14px;
    resize: none; max-height: 120px; min-height: 24px; line-height: 1.5;
  }
  .chat-textarea::placeholder { color: var(--text-muted); }
  .send-btn {
    width: 36px; height: 36px; border-radius: 9px; border: none; flex-shrink: 0;
    background: linear-gradient(135deg, var(--accent), var(--accent2)); color: white;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    font-size: 16px; transition: opacity 0.2s, transform 0.15s;
  }
  .send-btn:hover { opacity: 0.85; transform: scale(1.06); }
  .send-btn:disabled { opacity: 0.35; cursor: not-allowed; transform: none; }
  .input-hint { font-size: 11px; color: var(--text-muted); margin-top: 8px; text-align: center; }

  /* Empty state */
  .empty-state { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; padding: 40px; text-align: center; }
  .empty-icon { width: 60px; height: 60px; background: linear-gradient(135deg, var(--accent), var(--accent2)); border-radius: 18px; display: flex; align-items: center; justify-content: center; font-size: 28px; }
  .empty-state h3 { font-size: 18px; font-weight: 600; }
  .empty-state p { font-size: 13px; color: var(--text-muted); max-width: 340px; line-height: 1.6; }
  .suggestion-chips { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-top: 6px; }
  .chip {
    padding: 7px 14px; border-radius: 20px; border: 1px solid var(--border);
    background: var(--surface); font-size: 12px; color: var(--text-muted);
    cursor: pointer; transition: border-color 0.15s, color 0.15s; font-family: 'Sora', sans-serif;
  }
  .chip:hover { border-color: var(--accent); color: var(--accent); }
`;

// ─────────────────────────────────────────────────────────────────────────────

const HISTORY = [
  { id: 1, icon: "💼", title: "Frontend Developer Interview", meta: "Today · 12 msgs" },
  { id: 2, icon: "⚛️", title: "React Deep Dive Session",     meta: "Yesterday · 8 msgs" },
  { id: 3, icon: "🧠", title: "JavaScript Concepts",         meta: "May 25 · 15 msgs" },
  { id: 4, icon: "🏗️", title: "System Design Prep",         meta: "May 20 · 6 msgs" },
  { id: 5, icon: "📝", title: "Resume Review",               meta: "May 18 · 4 msgs" },
];

const SUGGESTIONS = [
  "Walk me through your resume",
  "What are your strengths?",
  "Explain a challenging project",
  "Why this role?",
];

const AI_RESPONSES = [
  "Great point! Let me ask you a follow-up — can you describe a specific situation where you had to handle conflicting priorities at work?",
  "That's a solid answer. Interviewers love concrete examples with measurable outcomes. Could you quantify the impact of what you did?",
  "Interesting! Tell me more about the technical decisions you made in that project and why you chose that particular approach.",
  "Good. Now let's shift gears — how do you keep up with the latest trends in frontend development?",
];

const nowStr = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
const formatTimer = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

const getSupportedMime = () => {
  const types = [
    "video/webm;codecs=vp9,opus",
    "video/webm;codecs=vp8,opus",
    "video/webm",
    "video/mp4",
  ];
  return types.find((t) => MediaRecorder.isTypeSupported(t)) || "video/webm";
};

// ── Upload via XHR (real upload progress) ────────────────────────────────────
function uploadVideoToBackend({ blob, questionText, msgIndex, onProgress }) {
  return new Promise((resolve, reject) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    const ext = blob.type.includes("mp4") ? "mp4" : "webm";
    formData.append("video", blob, `answer-q${msgIndex + 1}.${ext}`);
    formData.append("question", questionText);
    formData.append("questionIndex", String(msgIndex));
    formData.append("timestamp", new Date().toISOString());

    const xhr = new XMLHttpRequest();
    xhr.open("POST", UPLOAD_ENDPOINT);
    if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try { resolve(JSON.parse(xhr.responseText)); } catch { resolve({ ok: true }); }
      } else {
        reject(new Error(`Server responded with ${xhr.status}`));
      }
    };
    xhr.onerror = () => reject(new Error("Network error — check your connection"));
    xhr.send(formData);
  });
}

// ── Per-message recorder hook ────────────────────────────────────────────────
function useMessageRecorder() {
  const [recState,      setRecState]      = useState("idle"); // idle | recording | done
  const [blobUrl,       setBlobUrl]       = useState(null);
  const [blobRef,       setBlobRef]       = useState(null);
  const [elapsed,       setElapsed]       = useState(0);
  const [recError,      setRecError]      = useState(null);
  const [uploadState,   setUploadState]   = useState("idle"); // idle | uploading | success | failed
  const [uploadPct,     setUploadPct]     = useState(0);
  const [uploadError,   setUploadError]   = useState(null);

  const mrRef    = useRef(null);
  const chunks   = useRef([]);
  const streamRef= useRef(null);
  const timerRef = useRef(null);

  const start = useCallback(async (previewEl) => {
    setRecError(null);
    setUploadState("idle");
    setUploadPct(0);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (previewEl) { previewEl.srcObject = stream; previewEl.play(); }

      const mr = new MediaRecorder(stream, { mimeType: getSupportedMime() });
      mrRef.current = mr;
      chunks.current = [];

      mr.ondataavailable = (e) => { if (e.data.size > 0) chunks.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(chunks.current, { type: getSupportedMime() });
        setBlobRef(blob);
        setBlobUrl(URL.createObjectURL(blob));
        setRecState("done");
        stream.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      };

      mr.start(200);
      setRecState("recording");
      setElapsed(0);
      timerRef.current = setInterval(() => setElapsed((p) => p + 1), 1000);
    } catch {
      setRecError("Camera/mic permission denied. Please allow access and try again.");
    }
  }, []);

  const stop = useCallback(() => {
    clearInterval(timerRef.current);
    mrRef.current?.stop();
  }, []);

  const reset = useCallback(() => {
    if (blobUrl) URL.revokeObjectURL(blobUrl);
    setBlobUrl(null); setBlobRef(null);
    setRecState("idle"); setElapsed(0); setRecError(null);
    setUploadState("idle"); setUploadPct(0); setUploadError(null);
  }, [blobUrl]);

  const upload = useCallback(async (questionText, msgIndex) => {
    if (!blobRef) return;
    setUploadState("uploading");
    setUploadPct(0);
    setUploadError(null);
    try {
      await uploadVideoToBackend({
        blob: blobRef, questionText, msgIndex,
        onProgress: setUploadPct,
      });
      setUploadPct(100);
      setUploadState("success");
    } catch (err) {
      setUploadError(err.message || "Upload failed");
      setUploadState("failed");
    }
  }, [blobRef]);

  return {
    recState, blobUrl, elapsed, recError,
    uploadState, uploadPct, uploadError,
    start, stop, reset, upload,
  };
}

// ── Recording Controls (renders under each AI bubble) ────────────────────────
function RecordingControls({ msgIndex, questionText, onPreviewChange }) {
  const rec         = useMessageRecorder();
  const previewRef  = useRef(null);
  const [showModal, setShowModal] = useState(false);

  const handleStart    = () => { onPreviewChange(msgIndex, previewRef); rec.start(previewRef.current); };
  const handleStop     = () => { rec.stop(); onPreviewChange(null, null); };
  const handleDownload = () => {
    const a = document.createElement("a");
    a.href     = rec.blobUrl;
    a.download = `interview-answer-q${msgIndex + 1}.webm`;
    a.click();
  };
  const handleUpload = () => rec.upload(questionText, msgIndex);

  return (
    <>
      {/* hidden video – MediaRecorder source */}
      <video ref={previewRef} muted style={{ display: "none" }} />

      {/* ── Inline controls ── */}
      <div className="rec-controls">
        {rec.recState === "idle" && (
          <button className="rec-btn start" onClick={handleStart}>
            <span className="rec-dot" style={{ background: "var(--rec)" }} /> Record Answer
          </button>
        )}

        {rec.recState === "recording" && (
          <>
            <button className="rec-btn stop" onClick={handleStop}>■ Stop</button>
            <span className="rec-timer">
              <span className="rec-dot" style={{ marginRight: 5 }} />
              {formatTimer(rec.elapsed)}
            </span>
          </>
        )}

        {rec.recState === "done" && (
          <>
            <span className="rec-badge">✓ {formatTimer(rec.elapsed)}</span>
            <button className="rec-btn play" onClick={() => setShowModal(true)}>▶ Review &amp; Send</button>
            <button className="rec-btn start" onClick={rec.reset}>↺ Re-record</button>

            {/* upload status pill */}
            {rec.uploadState === "uploading" && (
              <span className="send-pill uploading"><span className="spin">⟳</span> Uploading…</span>
            )}
            {rec.uploadState === "success" && (
              <span className="send-pill success">✓ Sent to server</span>
            )}
            {rec.uploadState === "failed" && (
              <span className="send-pill failed" title={rec.uploadError}>✕ Upload failed — click Review &amp; Send to retry</span>
            )}
          </>
        )}

        {rec.recError && <span className="perm-error">⚠ {rec.recError}</span>}
      </div>

      {/* ── Playback + Upload Modal ── */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>

            {/* Header */}
            <div className="modal-header">
              <span className="modal-title">📹 Review Your Answer</span>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            {/* Question context */}
            <div className="modal-question">
              <strong>QUESTION #{msgIndex + 1}</strong>
              {questionText}
            </div>

            {/* Video */}
            <video className="modal-video" src={rec.blobUrl} controls />

            {/* Progress bar (only while uploading) */}
            {rec.uploadState === "uploading" && (
              <div className="upload-progress">
                <div className="upload-bar-track">
                  <div className="upload-bar-fill" style={{ width: `${rec.uploadPct}%` }} />
                </div>
                <div className="upload-bar-labels">
                  <span>Uploading to server…</span>
                  <span>{rec.uploadPct}%</span>
                </div>
              </div>
            )}

            {/* Success notice */}
            {rec.uploadState === "success" && (
              <div className="upload-notice success">
                ✓ Video successfully uploaded to the server
              </div>
            )}

            {/* Error notice */}
            {rec.uploadState === "failed" && (
              <div className="upload-notice failed">
                ✕ {rec.uploadError || "Upload failed. Please try again."}
              </div>
            )}

            {/* Actions */}
            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={() => setShowModal(false)}>Close</button>
              <button className="modal-btn download" onClick={handleDownload}>⬇ Download</button>

              {rec.uploadState === "idle" && (
                <button className="modal-btn send-to-server" onClick={handleUpload}>
                  ⬆ Send to Server
                </button>
              )}
              {rec.uploadState === "uploading" && (
                <button className="modal-btn send-to-server" disabled>
                  <span className="spin">⟳</span> Uploading {rec.uploadPct}%
                </button>
              )}
              {rec.uploadState === "success" && (
                <span className="modal-btn sent-ok">✓ Sent</span>
              )}
              {rec.uploadState === "failed" && (
                <button className="modal-btn send-err" onClick={handleUpload}>
                  ↺ Retry Upload
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
}

// ── Floating live camera preview ─────────────────────────────────────────────
function CameraPreview({ videoRef }) {
  if (!videoRef) return null;
  return (
    <div className="cam-preview">
      <video
        ref={(el) => {
          if (el && videoRef.current?.srcObject) {
            el.srcObject = videoRef.current.srcObject;
            el.play();
          }
        }}
        muted
        playsInline
        style={{ width: "100%", display: "block", transform: "scaleX(-1)" }}
      />
      <div className="cam-label">
        <span className="cam-live-dot" /> LIVE
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
const ChatScreen = () => {
  const location  = useLocation();
  const navigate  = useNavigate();
  const fileName  = location.state?.fileName || null;

  const [name,           setName]           = useState("");
  const [messages,       setMessages]       = useState([]);
  const [input,          setInput]          = useState("");
  const [typing,         setTyping]         = useState(false);
  const [activeHistory,  setActiveHistory]  = useState(1);
  const [activeRecording,setActiveRecording]= useState(null); // { msgIndex, videoRef }

  const bottomRef   = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/"); return; }
    try { setName(jwtDecode(token).name); } catch {}
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const sendMessage = (text) => {
    const content = text || input.trim();
    if (!content) return;
    setMessages((prev) => [...prev, { role: "user", content, time: nowStr() }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, {
        role: "ai",
        content: AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)],
        time: nowStr(),
      }]);
    }, 1400 + Math.random() * 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const handleTextareaInput = (e) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  };

  const handlePreviewChange = (msgIndex, videoRef) => {
    setActiveRecording(msgIndex !== null ? { msgIndex, videoRef } : null);
  };

  const isEmpty = messages.length === 0 && !typing;

  return (
    <>
      <style>{styles}</style>
      <div className="chat-root">

        {/* ── Sidebar ── */}
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
            <img className="avatar-sm" src="https://i.pravatar.cc/150?img=3" alt="User" />
            <div className="user-info">
              <div className="name">{name || "Candidate"}</div>
              <div className="role">Candidate</div>
            </div>
          </div>
        </aside>

        {/* ── Main Chat ── */}
        <main className="chat-main">
          <div className="chat-topbar">
            <div className="topbar-left">
              <span className="topbar-title">Interview Session</span>
              {fileName && <span className="resume-tag" title={fileName}>📄 {fileName}</span>}
            </div>
            <span className="session-tag">
              {messages.length} msg{messages.length !== 1 ? "s" : ""}
            </span>
          </div>

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
                  <button key={s} className="chip" onClick={() => sendMessage(s)}>{s}</button>
                ))}
              </div>
            </div>
          ) : (
            <div className="messages-area">
              {messages.map((msg, i) => (
                <div key={i} className={`msg-row ${msg.role}`}>
                  {msg.role === "ai"
                    ? <div className="ai-avatar-icon">✦</div>
                    : <img className="msg-avatar" src="https://i.pravatar.cc/150?img=3" alt="User" />
                  }
                  <div style={{ maxWidth: "68%" }}>
                    <div className={`bubble ${msg.role}`}>{msg.content}</div>
                    <div className="bubble-time">{msg.time}</div>
                    {msg.role === "ai" && (
                      <RecordingControls
                        msgIndex={i}
                        questionText={msg.content}
                        onPreviewChange={handlePreviewChange}
                      />
                    )}
                  </div>
                </div>
              ))}

              {typing && (
                <div className="msg-row ai">
                  <div className="ai-avatar-icon">✦</div>
                  <div className="bubble ai">
                    <div className="typing-indicator"><span /><span /><span /></div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}

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
              >↑</button>
            </div>
            <div className="input-hint">Press Enter to send · Shift+Enter for new line</div>
          </div>
        </main>

        {/* Floating live camera preview */}
        {activeRecording && <CameraPreview videoRef={activeRecording.videoRef} />}

      </div>
    </>
  );
};

export default ChatScreen;