import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const COLORS    = ["blue", "violet", "green", "gold"];
const AV_COLORS = ["av-blue", "av-violet", "av-green", "av-gold"];
const API = import.meta.env.VITE_API_URL;
// Schema: name(opt), company*, role*, topic*, difficulty*, experienceText*
const EMPTY_FORM = {
  name:           "",
  company:        "",
  role:           "",
  topic:          "",
  difficulty:     "",
  experienceText: "",
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #05080f;
    --card: #0c1120;
    --card-border: rgba(255,255,255,0.07);
    --surface2: #0f1623;
    --accent: #4f8ef7;
    --accent2: #a78bfa;
    --accent3: #34d399;
    --gold: #f59e0b;
    --rose: #f472b6;
    --danger: #f87171;
    --text: #e2e8f8;
    --muted: #5a6480;
    --radius: 20px;
  }

  body { background: var(--bg); }

  .share-root {
    min-height: 100vh; background: var(--bg);
    font-family: 'Outfit', sans-serif; color: var(--text); position: relative;
  }

  .share-root::before {
    content: ''; position: fixed; inset: 0;
    background:
      radial-gradient(ellipse 70% 55% at 10% 0%,  rgba(79,142,247,0.10) 0%, transparent 60%),
      radial-gradient(ellipse 55% 45% at 90% 100%, rgba(167,139,250,0.09) 0%, transparent 55%);
    pointer-events: none; z-index: 0;
  }

  .grid-bg {
    position: fixed; inset: 0;
    background-image: radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px);
    background-size: 38px 38px; pointer-events: none; z-index: 0;
  }

  .orb {
    position: fixed; border-radius: 50%;
    filter: blur(90px); opacity: 0.12;
    animation: drift 22s ease-in-out infinite alternate;
    pointer-events: none; z-index: 0;
  }
  .orb-a { width: 400px; height: 400px; background: #4f8ef7; top: -150px; left: -90px; }
  .orb-b { width: 320px; height: 320px; background: #a78bfa; bottom: -100px; right: -60px; animation-duration: 26s; animation-delay: -11s; }

  @keyframes drift {
    from { transform: translate(0,0) scale(1); }
    to   { transform: translate(28px,38px) scale(1.07); }
  }

  .share-content {
    position: relative; z-index: 1;
    max-width: 760px; margin: 0 auto; padding: 36px 28px 80px;
  }

  /* ── Topnav ── */
  .topnav {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 48px; animation: fadeDown 0.4s ease both;
  }
  @keyframes fadeDown {
    from { opacity: 0; transform: translateY(-14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .brand { display: flex; align-items: center; gap: 10px; cursor: pointer; }
  .brand-gem {
    width: 32px; height: 32px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    border-radius: 9px; display: flex; align-items: center; justify-content: center;
    font-size: 15px; box-shadow: 0 0 18px rgba(79,142,247,0.45);
  }
  .brand-name {
    font-family: 'Playfair Display', serif; font-size: 19px;
    background: linear-gradient(90deg, var(--accent), var(--accent2));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .back-btn {
    display: flex; align-items: center; gap: 7px;
    padding: 8px 18px; border-radius: 50px;
    border: 1px solid var(--card-border); background: var(--card);
    color: var(--muted); font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 500;
    cursor: pointer; transition: all 0.2s;
  }
  .back-btn:hover { color: var(--text); border-color: var(--accent); }

  /* ── Page header ── */
  .page-header { margin-bottom: 40px; animation: fadeUp 0.45s 0.05s ease both; }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .page-header h1 {
    font-family: 'Playfair Display', serif; font-size: 36px; line-height: 1.15; margin-bottom: 10px;
  }
  .page-header h1 span {
    background: linear-gradient(90deg, var(--accent), var(--accent2));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .page-header p { font-size: 14.5px; color: var(--muted); line-height: 1.7; max-width: 520px; }

  /* ── Steps ── */
  .steps-row {
    display: flex; align-items: center;
    margin-bottom: 36px; animation: fadeUp 0.45s 0.1s ease both;
  }
  .step-item { display: flex; align-items: center; gap: 8px; }
  .step-circle {
    width: 28px; height: 28px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700;
    border: 1.5px solid var(--card-border); background: var(--card); color: var(--muted);
    transition: all 0.3s; flex-shrink: 0;
  }
  .step-circle.active {
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    border-color: transparent; color: white; box-shadow: 0 0 14px rgba(79,142,247,0.4);
  }
  .step-circle.done { background: rgba(52,211,153,0.15); border-color: var(--accent3); color: var(--accent3); }
  .step-label { font-size: 12px; color: var(--muted); font-weight: 500; }
  .step-label.active { color: var(--text); }
  .step-connector { flex: 1; height: 1px; background: var(--card-border); margin: 0 12px; min-width: 30px; }

  /* ── Form card ── */
  .form-card {
    background: var(--card); border: 1px solid var(--card-border);
    border-radius: var(--radius); overflow: hidden; animation: fadeUp 0.45s 0.15s ease both;
  }
  .form-card-top { height: 3px; background: linear-gradient(90deg, var(--accent), var(--accent2), var(--rose)); }
  .form-inner { padding: 36px; }

  .section-title {
    font-size: 13px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--accent); margin-bottom: 22px; display: flex; align-items: center; gap: 8px;
  }
  .section-title::after { content: ''; flex: 1; height: 1px; background: var(--card-border); }

  /* ── Fields ── */
  .fields-grid   { display: grid; grid-template-columns: 1fr 1fr;     gap: 20px; margin-bottom: 20px; }
  .fields-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; margin-bottom: 20px; }
  .field-full    { margin-bottom: 20px; }
  .field         { display: flex; flex-direction: column; gap: 8px; }
  .field-label   {
    font-size: 11.5px; font-weight: 600;
    letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted);
  }
  .field-label .opt { color: var(--muted); font-weight: 400; font-size: 10px; margin-left: 4px; text-transform: none; }

  .field-input, .field-select, .field-textarea {
    width: 100%; background: var(--surface2);
    border: 1px solid var(--card-border); border-radius: 12px;
    padding: 12px 16px; color: var(--text);
    font-family: 'Outfit', sans-serif; font-size: 14px; outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    -webkit-appearance: none; appearance: none;
  }
  .field-input::placeholder, .field-textarea::placeholder { color: var(--muted); }
  .field-input:focus, .field-select:focus, .field-textarea:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(79,142,247,0.12);
    background: rgba(15,22,35,0.9);
  }
  .field-select { cursor: pointer; }
  .field-select option { background: #1a2035; }
  .field-textarea { resize: vertical; min-height: 160px; line-height: 1.7; }

  /* Char counter */
  .char-row { display: flex; justify-content: flex-end; font-size: 11px; color: var(--muted); margin-top: 5px; }
  .char-row.warn { color: var(--gold); }
  .char-row.ok   { color: var(--accent3); }

  /* Difficulty pills */
  .diff-pills { display: flex; gap: 10px; }
  .diff-pill {
    flex: 1; padding: 10px 14px; border-radius: 12px;
    border: 1.5px solid var(--card-border); background: var(--surface2);
    font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 600;
    cursor: pointer; transition: all 0.2s; text-align: center; color: var(--muted);
  }
  .diff-pill:hover { border-color: rgba(255,255,255,0.15); color: var(--text); }
  .diff-pill.sel-easy   { background: rgba(52,211,153,0.1);  border-color: var(--accent3); color: var(--accent3); box-shadow: 0 0 12px rgba(52,211,153,0.15); }
  .diff-pill.sel-medium { background: rgba(245,158,11,0.1);  border-color: var(--gold);    color: var(--gold);    box-shadow: 0 0 12px rgba(245,158,11,0.15); }
  .diff-pill.sel-hard   { background: rgba(248,113,113,0.1); border-color: var(--danger);  color: var(--danger);  box-shadow: 0 0 12px rgba(248,113,113,0.15); }

  /* Divider */
  .form-divider { height: 1px; background: var(--card-border); margin: 28px 0; }

  /* ── Preview ── */
  .preview-wrap {
    background: var(--surface2); border: 1px solid var(--card-border);
    border-radius: 14px; padding: 20px; margin-top: 8px;
  }
  .preview-label {
    font-size: 10px; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--muted); margin-bottom: 14px;
    display: flex; align-items: center; gap: 6px;
  }
  .preview-label::before { content: ''; display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--accent3); }
  .preview-card {
    background: var(--card); border: 1px solid var(--card-border);
    border-radius: 14px; padding: 18px; position: relative; overflow: hidden;
  }
  .preview-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, var(--accent), var(--accent2));
  }
  .preview-top { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
  .preview-avatar {
    width: 36px; height: 36px; border-radius: 50%;
    background: linear-gradient(135deg, var(--accent), #3b6fd4);
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; color: white; flex-shrink: 0;
  }
  .preview-name { font-size: 13px; font-weight: 600; }
  .preview-date { font-size: 11px; color: var(--muted); margin-top: 2px; }
  .preview-diff { margin-left: auto; padding: 2px 9px; border-radius: 20px; font-size: 10px; font-weight: 700; }
  .pdiff-easy   { background: rgba(52,211,153,0.12);  color: var(--accent3); }
  .pdiff-medium { background: rgba(245,158,11,0.12);  color: var(--gold); }
  .pdiff-hard   { background: rgba(248,113,113,0.12); color: var(--danger); }
  .preview-role-row { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; flex-wrap: wrap; }
  .preview-role    { font-size: 12px; font-weight: 600; color: var(--accent); }
  .preview-company { font-size: 11px; color: var(--muted); display: flex; align-items: center; gap: 4px; }
  .preview-company::before { content: '·'; color: var(--card-border); }
  .preview-badge {
    display: inline-block; padding: 2px 8px; border-radius: 20px;
    background: rgba(167,139,250,0.12); border: 1px solid rgba(167,139,250,0.2);
    font-size: 10px; color: var(--accent2); font-weight: 500; margin-bottom: 10px;
  }
  .preview-body {
    font-size: 12.5px; color: #8892a8; line-height: 1.6;
    display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
  }
  .preview-empty { font-size: 12px; color: var(--muted); font-style: italic; text-align: center; padding: 10px 0; }

  /* ── Actions ── */
  .form-actions {
    display: flex; align-items: center; justify-content: space-between;
    padding-top: 28px; border-top: 1px solid var(--card-border); margin-top: 8px;
  }
  .progress-dots { display: flex; gap: 5px; }
  .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--card-border); transition: all 0.3s; }
  .dot.filled { background: var(--accent); box-shadow: 0 0 6px rgba(79,142,247,0.5); }
  .actions-right { display: flex; gap: 10px; align-items: center; }

  .btn-secondary {
    padding: 11px 22px; border-radius: 50px;
    border: 1px solid var(--card-border); background: transparent;
    color: var(--muted); font-family: 'Outfit', sans-serif; font-size: 13.5px; font-weight: 500;
    cursor: pointer; transition: border-color 0.18s, color 0.18s;
  }
  .btn-secondary:hover { border-color: rgba(255,255,255,0.2); color: var(--text); }

  .btn-primary {
    display: flex; align-items: center; gap: 8px;
    padding: 11px 26px; border-radius: 50px; border: none;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    color: white; font-family: 'Outfit', sans-serif; font-size: 13.5px; font-weight: 600;
    cursor: pointer; box-shadow: 0 4px 20px rgba(79,142,247,0.38);
    transition: transform 0.18s, box-shadow 0.18s, opacity 0.18s;
  }
  .btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(79,142,247,0.5); }
  .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }

  /* ── Success ── */
  .success-screen {
    text-align: center; padding: 60px 36px;
    display: flex; flex-direction: column; align-items: center; gap: 18px;
    animation: fadeUp 0.5s ease both;
  }
  .success-icon {
    width: 72px; height: 72px; border-radius: 22px;
    background: linear-gradient(135deg, var(--accent3), #059669);
    display: flex; align-items: center; justify-content: center; font-size: 32px;
    box-shadow: 0 0 32px rgba(52,211,153,0.35);
    animation: pop 0.4s 0.1s cubic-bezier(0.34,1.56,0.64,1) both;
  }
  @keyframes pop {
    from { transform: scale(0.5); opacity: 0; }
    to   { transform: scale(1);   opacity: 1; }
  }
  .success-title { font-family: 'Playfair Display', serif; font-size: 28px; }
  .success-title span {
    background: linear-gradient(90deg, var(--accent3), var(--accent));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .success-desc  { font-size: 14px; color: var(--muted); line-height: 1.7; max-width: 380px; }
  .success-actions { display: flex; gap: 12px; margin-top: 8px; flex-wrap: wrap; justify-content: center; }

  /* ── Tips ── */
  .tips-card {
    background: var(--card); border: 1px solid var(--card-border);
    border-radius: var(--radius); padding: 24px; margin-top: 20px;
    animation: fadeUp 0.45s 0.2s ease both;
  }
  .tips-title {
    font-size: 12px; font-weight: 700; letter-spacing: 0.1em;
    text-transform: uppercase; color: var(--accent2); margin-bottom: 16px;
  }
  .tip-item {
    display: flex; align-items: flex-start; gap: 10px;
    margin-bottom: 14px; font-size: 13px; color: #8892a8; line-height: 1.6;
  }
  .tip-item:last-child { margin-bottom: 0; }
  .tip-icon { font-size: 15px; flex-shrink: 0; margin-top: 1px; }

  @media (max-width: 640px) {
    .fields-grid, .fields-grid-3 { grid-template-columns: 1fr; }
    .diff-pills { flex-direction: column; }
    .form-inner { padding: 24px; }
  }
`;

const TIPS = [
  { icon: "💡", text: "Be specific about which rounds were hardest and why — this helps others prepare." },
  { icon: "🎯", text: "Include the interview format: number of rounds, types of questions (DSA, system design, behavioral)." },
  { icon: "📚", text: "Mention what resources helped you most — books, platforms, mock interviews." },
  { icon: "🤝", text: "Describe the interviewer's style — was it conversational, pressure-based, or collaborative?" },
];

export default function ShareExperiencePage() {
  const navigate = useNavigate();
  const [form, setForm]           = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // Required fields: company, role, topic, difficulty, experienceText
  const requiredFilled = ["company","role","topic","difficulty","experienceText"].filter(k => form[k]).length;
  const filledFields   = Object.values(form).filter(Boolean).length;
  const allValid       = ["company","role","topic","difficulty","experienceText"].every(k => form[k]);
  const charCount      = form.experienceText.length;
  const charClass      = charCount > 800 ? "ok" : charCount > 400 ? "warn" : "";

  const handleSubmit = async () => {
    if (!allValid) return;
    setSubmitting(true);
    try {
      await axios.post(`${API}/shareEx/shareExperience`, {
        name:           form.name || undefined,   // optional
        company:        form.company,
        role:           form.role,
        topic:          form.topic,
        difficulty:     form.difficulty,
        experienceText: form.experienceText,
      }, { withCredentials: true });
      setSubmitted(true);
    } catch {
      alert("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const diffClass = (d) =>
    form.difficulty === d ? `diff-pill sel-${d.toLowerCase()}` : "diff-pill";

  return (
    <>
      <style>{styles}</style>
      <div className="share-root">
        <div className="grid-bg" />
        <div className="orb orb-a" />
        <div className="orb orb-b" />

        <div className="share-content">
          {/* Topnav */}
          <nav className="topnav">
            <div className="brand" onClick={() => navigate("/dashboard")}>
              <div className="brand-gem">✦</div>
              <span className="brand-name">InterviewAI</span>
            </div>
            <button className="back-btn" onClick={() => navigate("/experience")}>
              ← Back to Experiences
            </button>
          </nav>

          {!submitted ? (
            <>
              {/* Page header */}
              <div className="page-header">
                <h1>Share Your <span>Interview Story</span></h1>
                <p>Your experience could be the edge someone needs. Help the community by sharing what worked, what didn't, and what you wish you'd known.</p>
              </div>

              {/* Steps — 3 stages based on required fields progress */}
              <div className="steps-row">
                <div className="step-item">
                  <div className={`step-circle ${requiredFilled >= 2 ? "done" : "active"}`}>
                    {requiredFilled >= 2 ? "✓" : "1"}
                  </div>
                  <span className={`step-label ${requiredFilled < 2 ? "active" : ""}`}>Your Info</span>
                </div>
                <div className="step-connector" />
                <div className="step-item">
                  <div className={`step-circle ${requiredFilled >= 4 ? "done" : requiredFilled >= 2 ? "active" : ""}`}>
                    {requiredFilled >= 4 ? "✓" : "2"}
                  </div>
                  <span className={`step-label ${requiredFilled >= 2 && requiredFilled < 4 ? "active" : ""}`}>Interview Details</span>
                </div>
                <div className="step-connector" />
                <div className="step-item">
                  <div className={`step-circle ${allValid ? "done" : requiredFilled >= 4 ? "active" : ""}`}>
                    {allValid ? "✓" : "3"}
                  </div>
                  <span className={`step-label ${requiredFilled >= 4 ? "active" : ""}`}>Your Experience</span>
                </div>
              </div>

              {/* Form */}
              <div className="form-card">
                <div className="form-card-top" />
                <div className="form-inner">

                  {/* ── Section 1: About You ── */}
                  <div className="section-title">About You</div>
                  <div className="fields-grid-3">
                    <div className="field">
                      <label className="field-label">
                        Your Name <span className="opt">(optional)</span>
                      </label>
                      <input
                        className="field-input"
                        placeholder="e.g. Priya Sharma"
                        value={form.name}
                        onChange={e => set("name", e.target.value)}
                      />
                    </div>
                    <div className="field">
                      <label className="field-label">Company *</label>
                      <input
                        className="field-input"
                        placeholder="e.g. Google, Amazon"
                        value={form.company}
                        onChange={e => set("company", e.target.value)}
                      />
                    </div>
                    <div className="field">
                      <label className="field-label">Role Applied For *</label>
                      <input
                        className="field-input"
                        placeholder="e.g. Frontend Developer"
                        value={form.role}
                        onChange={e => set("role", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-divider" />

                  {/* ── Section 2: Interview Details ── */}
                  <div className="section-title">Interview Details</div>
                  <div className="fields-grid" style={{ marginBottom: 24 }}>
                    <div className="field">
                      <label className="field-label">Topic / Stack *</label>
                      <input
                        className="field-input"
                        placeholder="e.g. React, Python, DSA"
                        value={form.topic}
                        onChange={e => set("topic", e.target.value)}
                      />
                    </div>
                    <div className="field" />
                  </div>

                  <div className="field" style={{ marginBottom: 8 }}>
                    <label className="field-label">Overall Difficulty *</label>
                    <div className="diff-pills">
                      {["Easy", "Medium", "Hard"].map(d => (
                        <button key={d} className={diffClass(d)} onClick={() => set("difficulty", d)}>
                          {d === "Easy" ? "🟢" : d === "Medium" ? "🟡" : "🔴"} {d}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-divider" />

                  {/* ── Section 3: Experience Text ── */}
                  <div className="section-title">Your Experience</div>
                  <div className="field-full">
                    <div className="field">
                      <label className="field-label">Strategy & Story *</label>
                      <textarea
                        className="field-textarea"
                        placeholder="Walk us through your preparation, the interview format, what questions came up, what worked, what surprised you, and your top tips for others..."
                        value={form.experienceText}
                        onChange={e => set("experienceText", e.target.value)}
                      />
                    </div>
                    <div className={`char-row ${charClass}`}>
                      {charCount} chars{" "}
                      {charCount > 800 ? "— great detail! ✓" : charCount > 400 ? "— keep going…" : "— aim for 400+ chars"}
                    </div>
                  </div>

                  {/* Live Preview */}
                  {(form.name || form.company || form.role || form.experienceText) && (
                    <div className="preview-wrap">
                      <div className="preview-label">Live Preview</div>
                      <div className="preview-card">
                        <div className="preview-top">
                          <div className="preview-avatar">
                            {form.name?.[0]?.toUpperCase() || form.company?.[0]?.toUpperCase() || "?"}
                          </div>
                          <div>
                            <div className="preview-name">{form.name || "Anonymous"}</div>
                            <div className="preview-date">Just now</div>
                          </div>
                          {form.difficulty && (
                            <span className={`preview-diff pdiff-${form.difficulty.toLowerCase()}`}>
                              {form.difficulty}
                            </span>
                          )}
                        </div>
                        {(form.role || form.company) && (
                          <div className="preview-role-row">
                            {form.role    && <div className="preview-role">💼 {form.role}</div>}
                            {form.company && <div className="preview-company">🏢 {form.company}</div>}
                          </div>
                        )}
                        {form.topic && <div className="preview-badge">#{form.topic}</div>}
                        {form.experienceText
                          ? <div className="preview-body">{form.experienceText}</div>
                          : <div className="preview-empty">Your experience will appear here…</div>
                        }
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="form-actions">
                    <div className="progress-dots">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className={`dot ${i < filledFields ? "filled" : ""}`} />
                      ))}
                    </div>
                    <div className="actions-right">
                      <button className="btn-secondary" onClick={() => navigate("/experience")}>
                        Cancel
                      </button>
                      <button
                        className="btn-primary"
                        onClick={handleSubmit}
                        disabled={!allValid || submitting}
                      >
                        {submitting
                          ? <><span>Posting</span><span style={{ display:"inline-block", animation:"spin 1s linear infinite" }}>⟳</span></>
                          : <><span>Post Experience</span><span>✦</span></>
                        }
                      </button>
                    </div>
                  </div>

                </div>
              </div>

              {/* Tips */}
              <div className="tips-card">
                <div className="tips-title">💬 Tips for a great post</div>
                {TIPS.map((t, i) => (
                  <div className="tip-item" key={i}>
                    <span className="tip-icon">{t.icon}</span>
                    <span>{t.text}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* Success */
            <div className="form-card">
              <div className="form-card-top" />
              <div className="success-screen">
                <div className="success-icon">🎉</div>
                <div className="success-title">Experience <span>Posted!</span></div>
                <p className="success-desc">
                  Thank you{form.name ? `, ${form.name}` : ""}! Your interview story at{" "}
                  <strong style={{ color: "var(--text)" }}>{form.company}</strong> has been shared
                  with the community. It might just help someone land their dream job.
                </p>
                <div className="success-actions">
                  <button className="btn-secondary" onClick={() => { setForm(EMPTY_FORM); setSubmitted(false); }}>
                    Share Another
                  </button>
                  <button className="btn-primary" onClick={() => navigate("/experience")}>
                    <span>View All Experiences</span> <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}