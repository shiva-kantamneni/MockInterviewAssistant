import React, { useState } from 'react';

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
    --gold: #f59e0b;
    --text: #e2e8f8;
    --muted: #5a6480;
    --radius: 20px;
  }

  .sif-root {
    min-height: 100vh;
    background: var(--bg);
    font-family: 'Outfit', sans-serif;
    color: var(--text);
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 36px 20px 60px;
  }

  /* Ambient */
  .sif-root::before {
    content: '';
    position: fixed; inset: 0;
    background:
      radial-gradient(ellipse 65% 55% at 10% 5%,  rgba(79,142,247,0.11) 0%, transparent 60%),
      radial-gradient(ellipse 50% 45% at 90% 95%, rgba(167,139,250,0.10) 0%, transparent 55%);
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
    filter: blur(90px); opacity: 0.13;
    animation: drift 22s ease-in-out infinite alternate;
    pointer-events: none; z-index: 0;
  }
  .orb-a { width: 400px; height: 400px; background: #4f8ef7; top: -140px; left: -80px; }
  .orb-b { width: 320px; height: 320px; background: #a78bfa; bottom: -100px; right: -60px; animation-duration: 28s; animation-delay: -12s; }

  @keyframes drift {
    from { transform: translate(0,0) scale(1); }
    to   { transform: translate(28px,38px) scale(1.07); }
  }

  /* Page layout */
  .sif-page {
    position: relative; z-index: 1;
    width: 100%; max-width: 920px;
    animation: fadeUp 0.45s ease both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Brand */
  .brand-bar {
    display: flex; align-items: center; gap: 10px;
    margin-bottom: 30px;
  }
  .brand-gem {
    width: 32px; height: 32px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    font-size: 15px;
    box-shadow: 0 0 18px rgba(79,142,247,0.45);
  }
  .brand-name {
    font-family: 'Playfair Display', serif;
    font-size: 18px;
    background: linear-gradient(90deg, var(--accent), var(--accent2));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }

  /* Two-column layout */
  .sif-grid {
    display: grid;
    grid-template-columns: 1fr 1.4fr;
    gap: 22px;
    align-items: start;
  }

  /* Shared card style */
  .sif-card {
    background: var(--card);
    border: 1px solid var(--card-border);
    border-radius: var(--radius);
    overflow: hidden;
    position: relative;
  }

  .sif-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--accent), var(--accent2), transparent);
  }

  .card-head {
    padding: 22px 24px 16px;
    border-bottom: 1px solid var(--card-border);
    display: flex; align-items: center; gap: 12px;
  }

  .card-icon {
    width: 38px; height: 38px; border-radius: 11px;
    display: flex; align-items: center; justify-content: center;
    font-size: 17px; flex-shrink: 0;
  }

  .icon-blue   { background: rgba(79,142,247,0.15);  box-shadow: 0 0 12px rgba(79,142,247,0.2); }
  .icon-violet { background: rgba(167,139,250,0.15); box-shadow: 0 0 12px rgba(167,139,250,0.2); }

  .card-title {
    font-size: 15px; font-weight: 600; letter-spacing: 0.01em;
  }

  /* Instructions */
  .instructions-body {
    padding: 20px 24px 24px;
    display: flex; flex-direction: column; gap: 12px;
  }

  .instr-item {
    display: flex; align-items: flex-start; gap: 12px;
    padding: 12px 14px;
    background: var(--surface2);
    border: 1px solid var(--card-border);
    border-radius: 11px;
    font-size: 13.5px;
    line-height: 1.55;
    animation: fadeUp 0.4s ease both;
    transition: border-color 0.2s, background 0.2s;
  }

  .instr-item:hover { border-color: rgba(79,142,247,0.25); background: rgba(79,142,247,0.04); }

  .instr-item:nth-child(1) { animation-delay: 0.08s; }
  .instr-item:nth-child(2) { animation-delay: 0.13s; }
  .instr-item:nth-child(3) { animation-delay: 0.18s; }
  .instr-item:nth-child(4) { animation-delay: 0.23s; }
  .instr-item:nth-child(5) { animation-delay: 0.28s; }

  .instr-num {
    width: 24px; height: 24px; border-radius: 50%; flex-shrink: 0;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; color: white;
    box-shadow: 0 0 10px rgba(79,142,247,0.35);
  }

  /* Form */
  .form-body {
    padding: 22px 24px 26px;
    display: flex; flex-direction: column; gap: 18px;
  }

  .field-group { display: flex; flex-direction: column; gap: 7px; }

  .field-label {
    font-size: 12px; font-weight: 600;
    letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--muted);
    display: flex; align-items: center; gap: 6px;
  }

  .field-label .label-icon { font-size: 13px; }

  .field-input,
  .field-select,
  .field-textarea {
    width: 100%;
    background: var(--surface2);
    border: 1px solid var(--card-border);
    border-radius: 11px;
    padding: 11px 15px;
    color: var(--text);
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    -webkit-appearance: none;
    appearance: none;
  }

  .field-input::placeholder,
  .field-textarea::placeholder { color: var(--muted); }

  .field-input:focus,
  .field-select:focus,
  .field-textarea:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(79,142,247,0.13);
    background: rgba(79,142,247,0.04);
  }

  /* Custom select arrow */
  .select-wrap { position: relative; }
  .select-wrap::after {
    content: '▾';
    position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
    color: var(--muted); font-size: 13px; pointer-events: none;
  }

  .field-select { padding-right: 36px; cursor: pointer; }
  .field-select option { background: #1a2035; color: var(--text); }

  /* Difficulty pills */
  .diff-pills { display: flex; gap: 8px; }

  .diff-pill {
    flex: 1; padding: 9px 0; border-radius: 50px;
    border: 1px solid var(--card-border);
    background: var(--surface2);
    color: var(--muted);
    font-family: 'Outfit', sans-serif;
    font-size: 13px; font-weight: 500;
    cursor: pointer;
    transition: all 0.18s;
    text-align: center;
  }

  .diff-pill:hover { border-color: var(--accent); color: var(--accent); }

  .diff-pill.active-easy   { background: rgba(52,211,153,0.12); border-color: #34d399; color: #34d399; box-shadow: 0 0 12px rgba(52,211,153,0.2); }
  .diff-pill.active-medium { background: rgba(245,158,11,0.12);  border-color: #f59e0b; color: #f59e0b; box-shadow: 0 0 12px rgba(245,158,11,0.2); }
  .diff-pill.active-hard   { background: rgba(248,113,113,0.12); border-color: #f87171; color: #f87171; box-shadow: 0 0 12px rgba(248,113,113,0.2); }

  .field-textarea {
    resize: vertical; min-height: 80px; line-height: 1.6;
  }

  /* Optional badge */
  .optional-badge {
    margin-left: 6px; padding: 2px 8px; border-radius: 20px;
    background: rgba(167,139,250,0.12); border: 1px solid rgba(167,139,250,0.25);
    font-size: 9.5px; font-weight: 600; color: var(--accent2);
    text-transform: uppercase; letter-spacing: 0.08em;
    vertical-align: middle;
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
    display: flex; align-items: center; justify-content: center; gap: 10px;
    margin-top: 4px;
  }

  .submit-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 30px rgba(79,142,247,0.52); }
  .submit-btn:active { transform: translateY(0); opacity: 0.88; }

  .submit-btn .btn-arrow {
    display: inline-flex; align-items: center; justify-content: center;
    width: 22px; height: 22px; border-radius: 50%;
    background: rgba(255,255,255,0.2); font-size: 12px;
  }
`;

const INSTRUCTIONS = [
  { icon: "📋", text: "Questions will appear one by one on screen." },
  { icon: "⏭️", text: "Once a question is skipped, you cannot reattempt it." },
  { icon: "🎥", text: "Your video response will be recorded automatically." },
  { icon: "👁️", text: "Maintain eye contact and answer with confidence." },
  { icon: "📊", text: "You'll receive feedback based on your answers and expressions." },
];

const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

export default function StartInterviewForm({ onSubmit }) {
  const [topic, setTopic] = useState('');
  const [role, setRole] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [customQuestion, setCustomQuestion] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!difficulty) { alert('Please select a difficulty level.'); return; }
    if (onSubmit) onSubmit({ topic, role, difficulty, customQuestion });
  };

  return (
    <>
      <style>{styles}</style>
      <div className="sif-root">
        <div className="grid-bg" />
        <div className="orb orb-a" />
        <div className="orb orb-b" />

        <div className="sif-page">
          {/* Brand */}
          <div className="brand-bar">
            <div className="brand-gem">✦</div>
            <span className="brand-name">InterviewAI</span>
          </div>

          <div className="sif-grid">
            {/* Instructions card */}
            <div className="sif-card">
              <div className="card-head">
                <div className="card-icon icon-blue">📌</div>
                <div className="card-title">Before You Begin</div>
              </div>
              <div className="instructions-body">
                {INSTRUCTIONS.map((item, i) => (
                  <div className="instr-item" key={i}>
                    <div className="instr-num">{i + 1}</div>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Form card */}
            <div className="sif-card">
              <div className="card-head">
                <div className="card-icon icon-violet">🎯</div>
                <div className="card-title">Configure Your Interview</div>
              </div>

              <form onSubmit={handleSubmit} className="form-body">
                {/* Topic */}
                <div className="field-group">
                  <label className="field-label">
                    <span className="label-icon">🧠</span> Topic
                  </label>
                  <input
                    className="field-input"
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. React, System Design, Python…"
                    required
                  />
                </div>

                {/* Role */}
                <div className="field-group">
                  <label className="field-label">
                    <span className="label-icon">💼</span> Role
                  </label>
                  <input
                    className="field-input"
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Frontend Developer, Data Scientist…"
                    required
                  />
                </div>

                {/* Difficulty */}
                <div className="field-group">
                  <label className="field-label">
                    <span className="label-icon">⚡</span> Difficulty Level
                  </label>
                  <div className="diff-pills">
                    {DIFFICULTIES.map((d) => (
                      <button
                        type="button"
                        key={d}
                        className={`diff-pill ${difficulty === d ? `active-${d.toLowerCase()}` : ''}`}
                        onClick={() => setDifficulty(d)}
                      >
                        {d === 'Easy' ? '🟢' : d === 'Medium' ? '🟡' : '🔴'} {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom question */}
                <div className="field-group">
                  <label className="field-label">
                    <span className="label-icon">✏️</span> Custom Question
                    <span className="optional-badge">Optional</span>
                  </label>
                  <textarea
                    className="field-textarea"
                    placeholder="Type a specific question you'd like to be asked…"
                    value={customQuestion}
                    onChange={(e) => setCustomQuestion(e.target.value)}
                  />
                </div>

                <button type="submit" className="submit-btn">
                  Attempt Interview
                  <span className="btn-arrow">→</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}