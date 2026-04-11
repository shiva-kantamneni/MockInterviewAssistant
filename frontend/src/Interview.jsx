import React, { useState, useEffect, useRef } from 'react';
import StartInterviewForm from './StartInterviewForm';
import Webcam from 'react-webcam';
// const API = import.meta.env.VITE_API_URL;
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:wght@700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #05080f;
    --card: #0c1120;
    --card-border: rgba(255,255,255,0.07);
    --surface: #111827;
    --accent: #4f8ef7;
    --accent2: #a78bfa;
    --accent3: #34d399;
    --danger: #f87171;
    --gold: #f59e0b;
    --text: #e2e8f8;
    --muted: #5a6480;
    --radius: 20px;
  }

  .iv-root {
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

  /* Ambient background */
  .iv-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background:
      radial-gradient(ellipse 70% 55% at 15% 0%, rgba(79,142,247,0.11) 0%, transparent 60%),
      radial-gradient(ellipse 55% 45% at 85% 100%, rgba(167,139,250,0.10) 0%, transparent 55%),
      radial-gradient(ellipse 40% 35% at 50% 50%, rgba(52,211,153,0.04) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  .grid-bg {
    position: fixed;
    inset: 0;
    background-image: radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px);
    background-size: 38px 38px;
    pointer-events: none;
    z-index: 0;
  }

  .orb {
    position: fixed;
    border-radius: 50%;
    filter: blur(90px);
    opacity: 0.14;
    animation: drift 20s ease-in-out infinite alternate;
    pointer-events: none;
    z-index: 0;
  }
  .orb-a { width: 420px; height: 420px; background: #4f8ef7; top: -160px; left: -100px; }
  .orb-b { width: 340px; height: 340px; background: #a78bfa; bottom: -100px; right: -80px; animation-duration: 26s; animation-delay: -10s; }

  @keyframes drift {
    from { transform: translate(0,0) scale(1); }
    to   { transform: translate(28px, 38px) scale(1.07); }
  }

  /* ── Screen wrapper ── */
  .iv-screen {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 860px;
    animation: fadeUp 0.45s ease both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Brand bar ── */
  .brand-bar {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 28px;
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
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* ── Interview card ── */
  .iv-card {
    background: var(--card);
    border: 1px solid var(--card-border);
    border-radius: var(--radius);
    overflow: hidden;
    position: relative;
  }

  .iv-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--accent), var(--accent2), transparent);
  }

  /* ── Progress header ── */
  .iv-header {
    padding: 22px 28px 18px;
    border-bottom: 1px solid var(--card-border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
  }

  .q-label {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 4px;
  }

  .q-counter {
    font-size: 20px;
    font-weight: 700;
    background: linear-gradient(90deg, var(--accent), var(--accent2));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .progress-bar-wrap {
    flex: 1;
    height: 6px;
    background: rgba(255,255,255,0.07);
    border-radius: 10px;
    overflow: hidden;
  }

  .progress-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--accent), var(--accent2));
    border-radius: 10px;
    transition: width 0.5s ease;
    box-shadow: 0 0 10px rgba(79,142,247,0.5);
  }

  /* ── Timer ── */
  .timer-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .timer-ring {
    position: relative;
    width: 52px; height: 52px;
  }

  .timer-ring svg {
    transform: rotate(-90deg);
  }

  .timer-ring .ring-bg {
    fill: none;
    stroke: rgba(255,255,255,0.07);
    stroke-width: 4;
  }

  .timer-ring .ring-fill {
    fill: none;
    stroke-width: 4;
    stroke-linecap: round;
    transition: stroke-dashoffset 1s linear, stroke 0.5s;
  }

  .timer-num {
    position: absolute;
    inset: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px;
    font-weight: 700;
  }

  /* ── Body ── */
  .iv-body {
    padding: 28px;
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 24px;
    align-items: start;
  }

  /* Question */
  .question-block {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .question-card {
    background: var(--surface);
    border: 1px solid var(--card-border);
    border-radius: 14px;
    padding: 22px;
    position: relative;
    overflow: hidden;
  }

  .question-card::before {
    content: '"';
    position: absolute;
    top: -10px; left: 14px;
    font-size: 80px;
    font-family: 'Playfair Display', serif;
    color: rgba(79,142,247,0.1);
    line-height: 1;
    pointer-events: none;
  }

  .question-text {
    font-size: 16px;
    line-height: 1.7;
    font-weight: 500;
    position: relative;
    z-index: 1;
  }

  /* Tips */
  .tip-box {
    background: rgba(79,142,247,0.06);
    border: 1px solid rgba(79,142,247,0.18);
    border-radius: 12px;
    padding: 14px 16px;
  }

  .tip-label {
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 6px;
  }

  .tip-text {
    font-size: 13px;
    color: var(--muted);
    line-height: 1.6;
  }

  /* Action buttons */
  .action-buttons {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin-top: 4px;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 22px;
    border-radius: 50px;
    border: none;
    font-family: 'Outfit', sans-serif;
    font-size: 13.5px;
    font-weight: 600;
    cursor: pointer;
    letter-spacing: 0.02em;
    transition: transform 0.18s, box-shadow 0.18s, opacity 0.18s;
  }

  .btn:hover { transform: translateY(-2px); opacity: 0.9; }
  .btn:active { transform: translateY(0); }

  .btn-record {
    background: linear-gradient(135deg, #ef4444, #f97316);
    color: white;
    box-shadow: 0 4px 18px rgba(239,68,68,0.35);
  }

  .btn-record.recording {
    background: linear-gradient(135deg, #7f1d1d, #b91c1c);
    animation: pulse-red 1.4s ease infinite;
  }

  @keyframes pulse-red {
    0%,100% { box-shadow: 0 4px 18px rgba(239,68,68,0.35); }
    50%      { box-shadow: 0 4px 28px rgba(239,68,68,0.7); }
  }

  .btn-skip {
    background: transparent;
    border: 1px solid var(--card-border);
    color: var(--muted);
  }

  .btn-skip:hover { border-color: var(--accent); color: var(--accent); }

  /* Webcam panel */
  .webcam-panel {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .webcam-frame {
    border-radius: 14px;
    overflow: hidden;
    border: 1px solid var(--card-border);
    position: relative;
    background: #000;
  }

  .webcam-frame video,
  .webcam-frame .react-webcam {
    width: 100%;
    display: block;
    border-radius: 14px;
  }

  .rec-indicator {
    position: absolute;
    top: 10px; right: 10px;
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(8px);
    border-radius: 20px;
    padding: 4px 10px;
    font-size: 11px;
    font-weight: 600;
    color: white;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .rec-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: var(--danger);
    animation: blink 1s ease infinite;
  }

  @keyframes blink {
    0%,100% { opacity: 1; }
    50%      { opacity: 0.2; }
  }

  .webcam-label {
    font-size: 11px;
    color: var(--muted);
    text-align: center;
    letter-spacing: 0.04em;
  }

  /* ── Done screen ── */
  .done-header {
    text-align: center;
    padding: 40px 28px 24px;
    border-bottom: 1px solid var(--card-border);
  }

  .done-icon {
    width: 64px; height: 64px;
    background: linear-gradient(135deg, var(--accent3), var(--accent));
    border-radius: 20px;
    display: flex; align-items: center; justify-content: center;
    font-size: 28px;
    margin: 0 auto 18px;
    box-shadow: 0 0 28px rgba(52,211,153,0.35);
  }

  .done-title {
    font-family: 'Playfair Display', serif;
    font-size: 26px;
    margin-bottom: 8px;
    background: linear-gradient(90deg, var(--accent3), var(--accent));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .done-sub {
    font-size: 14px;
    color: var(--muted);
  }

  .recordings-list {
    padding: 24px 28px;
    display: flex;
    flex-direction: column;
    gap: 18px;
    max-height: 60vh;
    overflow-y: auto;
  }

  .recordings-list::-webkit-scrollbar { width: 5px; }
  .recordings-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 5px; }

  .recording-item {
    background: var(--surface);
    border: 1px solid var(--card-border);
    border-radius: 14px;
    padding: 18px;
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 16px;
    align-items: center;
    transition: border-color 0.2s;
  }

  .recording-item:hover { border-color: rgba(79,142,247,0.3); }

  .ri-q-label {
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 5px;
  }

  .ri-q-text {
    font-size: 14px;
    font-weight: 500;
    line-height: 1.5;
    color: var(--text);
  }

  .ri-video {
    width: 180px;
    border-radius: 10px;
    border: 1px solid var(--card-border);
  }

  .done-footer {
    padding: 18px 28px 28px;
    display: flex;
    justify-content: center;
  }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 28px;
    border-radius: 50px;
    border: none;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    color: white;
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.18s, box-shadow 0.18s;
    box-shadow: 0 4px 18px rgba(79,142,247,0.35);
  }

  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(79,142,247,0.5); }
`;

const TIPS = [
  "Use the STAR method: Situation, Task, Action, Result.",
  "Take a breath before answering — it's okay to pause.",
  "Be specific. Concrete examples impress interviewers.",
  "Keep your answer under 2 minutes for best impact.",
  "It's fine to ask for clarification on the question.",
];

export default function InterviewApp() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState('form');
  const [timeLeft, setTimeLeft] = useState(60);
  const timerRef = useRef(null);
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [recording, setRecording] = useState(false);
  const [recordedBlobs, setRecordedBlobs] = useState([]);
  const [tip] = useState(TIPS[Math.floor(Math.random() * TIPS.length)]);

  const handleFormSubmit = async ({ topic, role, difficulty, customQuestion }) => {
    try {
      const response = await fetch('http://localhost:5000/interview/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, role, difficulty, customQuestion }),
      });
      const data = await response.json();
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setCurrentIndex(0);
        setPhase('interview');
        setTimeLeft(60);
      } else {
        alert('No questions found.');
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      alert('Something went wrong while fetching questions.');
    }
  };

  const goToNextQuestion = () => {
    clearInterval(timerRef.current);
    stopRecording();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setTimeLeft(60);
    } else {
      setPhase('done');
    }
  };

  useEffect(() => {
    if (phase === 'interview') {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) { goToNextQuestion(); return 60; }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [currentIndex, phase]);

  const startRecording = () => {
    const stream = webcamRef.current.stream;
    const recorder = new MediaRecorder(stream);
    const chunks = [];
    recorder.ondataavailable = e => chunks.push(e.data);
    recorder.onstop = () => {
      const videoBlob = new Blob(chunks, { type: 'video/webm' });
      setRecordedBlobs(prev => [...prev, { question: questions[currentIndex], video: videoBlob }]);
    };
    recorder.start();
    mediaRecorderRef.current = recorder;
    setRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  // Timer ring math
  const TOTAL = 60;
  const CIRC = 2 * Math.PI * 20; // r=20
  const ringOffset = CIRC - (timeLeft / TOTAL) * CIRC;
  const ringColor = timeLeft > 30 ? '#4f8ef7' : timeLeft > 15 ? '#f59e0b' : '#f87171';
  const progress = ((currentIndex + 1) / (questions.length || 1)) * 100;

  if (phase === 'form') {
    return <StartInterviewForm onSubmit={handleFormSubmit} />;
  }

  if (phase === 'interview') {
    return (
      <>
        <style>{styles}</style>
        <div className="iv-root">
          <div className="grid-bg" />
          <div className="orb orb-a" />
          <div className="orb orb-b" />

          <div className="iv-screen">
            <div className="brand-bar">
              <div className="brand-gem">✦</div>
              <span className="brand-name">InterviewAI</span>
            </div>

            <div className="iv-card">
              {/* Header */}
              <div className="iv-header">
                <div>
                  <div className="q-label">Question</div>
                  <div className="q-counter">{currentIndex + 1} / {questions.length}</div>
                </div>

                <div className="progress-bar-wrap">
                  <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
                </div>

                <div className="timer-wrap">
                  <div className="timer-ring">
                    <svg width="52" height="52" viewBox="0 0 48 48">
                      <circle className="ring-bg" cx="24" cy="24" r="20" />
                      <circle
                        className="ring-fill"
                        cx="24" cy="24" r="20"
                        stroke={ringColor}
                        strokeDasharray={CIRC}
                        strokeDashoffset={ringOffset}
                      />
                    </svg>
                    <div className="timer-num" style={{ color: ringColor }}>{timeLeft}s</div>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="iv-body">
                <div className="question-block">
                  <div className="question-card">
                    <div className="question-text">{questions[currentIndex]}</div>
                  </div>

                  <div className="tip-box">
                    <div className="tip-label">💡 Quick Tip</div>
                    <div className="tip-text">{tip}</div>
                  </div>

                  <div className="action-buttons">
                    {!recording ? (
                      <button className="btn btn-record" onClick={startRecording}>
                        ● Start Recording
                      </button>
                    ) : (
                      <button className="btn btn-record recording" onClick={stopRecording}>
                        ■ Stop Recording
                      </button>
                    )}
                    <button className="btn btn-skip" onClick={goToNextQuestion}>
                      {currentIndex < questions.length - 1 ? '→ Next Question' : '✓ Finish'}
                    </button>
                  </div>
                </div>

                {/* Webcam */}
                <div className="webcam-panel">
                  <div className="webcam-frame">
                    <Webcam audio={true} ref={webcamRef} mirrored={true} style={{ width: '100%', borderRadius: 14 }} />
                    {recording && (
                      <div className="rec-indicator">
                        <div className="rec-dot" /> REC
                      </div>
                    )}
                  </div>
                  <div className="webcam-label">
                    {recording ? '🔴 Recording in progress...' : '📷 Camera ready'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (phase === 'done') {
    return (
      <>
        <style>{styles}</style>
        <div className="iv-root">
          <div className="grid-bg" />
          <div className="orb orb-a" />
          <div className="orb orb-b" />

          <div className="iv-screen">
            <div className="brand-bar">
              <div className="brand-gem">✦</div>
              <span className="brand-name">InterviewAI</span>
            </div>

            <div className="iv-card">
              <div className="done-header">
                <div className="done-icon">🎉</div>
                <div className="done-title">Interview Complete!</div>
                <div className="done-sub">
                  You answered {recordedBlobs.length} of {questions.length} questions.
                </div>
              </div>

              {recordedBlobs.length > 0 && (
                <div className="recordings-list">
                  {recordedBlobs.map((item, idx) => (
                    <div className="recording-item" key={idx}>
                      <div>
                        <div className="ri-q-label">Question {idx + 1}</div>
                        <div className="ri-q-text">{item.question}</div>
                      </div>
                      <video
                        className="ri-video"
                        src={URL.createObjectURL(item.video)}
                        controls
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="done-footer">
                <button className="btn-primary" onClick={() => setPhase('form')}>
                  ✦ Start New Interview
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return null;
}