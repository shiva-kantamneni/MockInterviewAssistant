import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const API = import.meta.env.VITE_API_URL;
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:wght@700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #05080f; --card: #0c1120; --card-border: rgba(255,255,255,0.07);
    --surface: #111827; --surface2: #0f1623;
    --accent: #4f8ef7; --accent2: #a78bfa; --accent3: #34d399;
    --gold: #f59e0b; --rose: #f472b6; --danger: #f87171;
    --text: #e2e8f8; --muted: #5a6480; --radius: 20px;
  }

  .exp-root {
    min-height: 100vh; background: var(--bg);
    font-family: 'Outfit', sans-serif; color: var(--text);
    position: relative; overflow-x: hidden;
  }
  .exp-root::before {
    content: ''; position: fixed; inset: 0;
    background:
      radial-gradient(ellipse 70% 55% at 10% 0%,  rgba(79,142,247,0.10) 0%, transparent 60%),
      radial-gradient(ellipse 55% 45% at 90% 100%, rgba(167,139,250,0.09) 0%, transparent 55%),
      radial-gradient(ellipse 35% 35% at 55% 50%, rgba(52,211,153,0.04) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
  }
  .grid-bg {
    position: fixed; inset: 0;
    background-image: radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px);
    background-size: 38px 38px; pointer-events: none; z-index: 0;
  }
  .orb { position: fixed; border-radius: 50%; filter: blur(90px); opacity: 0.13; animation: drift 22s ease-in-out infinite alternate; pointer-events: none; z-index: 0; }
  .orb-a { width: 400px; height: 400px; background: #4f8ef7; top: -150px; left: -90px; }
  .orb-b { width: 320px; height: 320px; background: #a78bfa; bottom: -100px; right: -60px; animation-duration: 26s; animation-delay: -11s; }
  @keyframes drift { from { transform: translate(0,0) scale(1); } to { transform: translate(28px,38px) scale(1.07); } }

  .exp-content { position: relative; z-index: 1; max-width: 1100px; margin: 0 auto; padding: 36px 28px 80px; }

  /* Topnav */
  .topnav { display: flex; align-items: center; justify-content: space-between; margin-bottom: 40px; animation: fadeDown 0.4s ease both; }
  @keyframes fadeDown { from { opacity: 0; transform: translateY(-14px); } to { opacity: 1; transform: translateY(0); } }
  .brand { display: flex; align-items: center; gap: 10px; cursor: pointer; }
  .brand-gem { width: 32px; height: 32px; background: linear-gradient(135deg, var(--accent), var(--accent2)); border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 15px; box-shadow: 0 0 18px rgba(79,142,247,0.45); }
  .brand-name { font-family: 'Playfair Display', serif; font-size: 19px; background: linear-gradient(90deg, var(--accent), var(--accent2)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .nav-pills { display: flex; gap: 6px; }
  .nav-pill { padding: 7px 18px; border-radius: 50px; border: 1px solid var(--card-border); background: var(--card); color: var(--muted); font-family: 'Outfit', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
  .nav-pill:hover { color: var(--text); border-color: var(--accent); }
  .nav-pill.active { background: var(--accent); border-color: var(--accent); color: white; box-shadow: 0 0 14px rgba(79,142,247,0.4); }

  /* Page header */
  .page-header { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 32px; animation: fadeUp 0.45s 0.05s ease both; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
  .ph-left h1 { font-family: 'Playfair Display', serif; font-size: 32px; line-height: 1.15; margin-bottom: 6px; }
  .ph-left h1 span { background: linear-gradient(90deg, var(--accent), var(--accent2)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .ph-left p { font-size: 14px; color: var(--muted); }
  .add-btn { display: flex; align-items: center; gap: 9px; padding: 11px 22px; border-radius: 50px; border: none; background: linear-gradient(135deg, var(--accent), var(--accent2)); color: white; font-family: 'Outfit', sans-serif; font-size: 13.5px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 20px rgba(79,142,247,0.38); transition: transform 0.18s, box-shadow 0.18s; white-space: nowrap; }
  .add-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(79,142,247,0.5); }

  /* Filters */
  .filters-row { display: flex; align-items: center; gap: 10px; margin-bottom: 28px; flex-wrap: wrap; animation: fadeUp 0.45s 0.1s ease both; }
  .search-wrap { position: relative; flex: 1; min-width: 220px; }
  .search-icon { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); color: var(--muted); font-size: 14px; pointer-events: none; }
  .search-input { width: 100%; background: var(--card); border: 1px solid var(--card-border); border-radius: 50px; padding: 10px 16px 10px 38px; color: var(--text); font-family: 'Outfit', sans-serif; font-size: 13.5px; outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
  .search-input::placeholder { color: var(--muted); }
  .search-input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(79,142,247,0.12); }
  .filter-pill { padding: 8px 16px; border-radius: 50px; border: 1px solid var(--card-border); background: var(--card); color: var(--muted); font-family: 'Outfit', sans-serif; font-size: 12.5px; font-weight: 500; cursor: pointer; transition: all 0.18s; white-space: nowrap; }
  .filter-pill:hover { border-color: var(--accent); color: var(--accent); }
  .filter-pill.active-pill { background: rgba(79,142,247,0.12); border-color: var(--accent); color: var(--accent); }

  /* Stats */
  .stats-bar { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 32px; animation: fadeUp 0.45s 0.15s ease both; }
  .stat-card { background: var(--card); border: 1px solid var(--card-border); border-radius: 14px; padding: 16px 20px; display: flex; align-items: center; gap: 14px; transition: border-color 0.2s, transform 0.2s; }
  .stat-card:hover { border-color: rgba(79,142,247,0.25); transform: translateY(-2px); }
  .stat-icon { width: 40px; height: 40px; border-radius: 11px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
  .icon-blue   { background: rgba(79,142,247,0.14);  box-shadow: 0 0 12px rgba(79,142,247,0.18); }
  .icon-violet { background: rgba(167,139,250,0.14); box-shadow: 0 0 12px rgba(167,139,250,0.18); }
  .icon-green  { background: rgba(52,211,153,0.12);  box-shadow: 0 0 12px rgba(52,211,153,0.18); }
  .stat-info .snum { font-size: 22px; font-weight: 700; line-height: 1; }
  .stat-info .slbl { font-size: 11.5px; color: var(--muted); margin-top: 3px; letter-spacing: 0.04em; }

  /* Cards grid */
  .cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
  .exp-card { background: var(--card); border: 1px solid var(--card-border); border-radius: var(--radius); padding: 24px; position: relative; overflow: hidden; transition: transform 0.25s, border-color 0.25s, box-shadow 0.25s; animation: fadeUp 0.45s ease both; cursor: pointer; }
  .exp-card:hover { transform: translateY(-4px); border-color: rgba(79,142,247,0.3); box-shadow: 0 16px 48px rgba(0,0,0,0.45), 0 0 0 1px rgba(79,142,247,0.08); }
  .exp-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px; opacity: 0; transition: opacity 0.25s; }
  .exp-card:hover::before { opacity: 1; }
  .exp-card.color-blue::before   { background: linear-gradient(90deg, var(--accent), var(--accent2)); }
  .exp-card.color-violet::before { background: linear-gradient(90deg, var(--accent2), var(--rose)); }
  .exp-card.color-green::before  { background: linear-gradient(90deg, var(--accent3), var(--accent)); }
  .exp-card.color-gold::before   { background: linear-gradient(90deg, var(--gold), var(--rose)); }
  .quote-deco { position: absolute; top: -8px; right: 16px; font-family: 'Playfair Display', serif; font-size: 72px; color: rgba(79,142,247,0.07); line-height: 1; pointer-events: none; }

  /* Card content */
  .card-top { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
  .user-avatar { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 15px; font-weight: 700; flex-shrink: 0; color: white; }
  .av-blue   { background: linear-gradient(135deg, var(--accent), #3b6fd4); }
  .av-violet { background: linear-gradient(135deg, var(--accent2), #7c3aed); }
  .av-green  { background: linear-gradient(135deg, var(--accent3), #059669); }
  .av-gold   { background: linear-gradient(135deg, var(--gold), #d97706); }
  .user-meta .uname { font-size: 14px; font-weight: 600; }
  .user-meta .udate { font-size: 11.5px; color: var(--muted); margin-top: 2px; }
  .diff-tag { margin-left: auto; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
  .tag-easy   { background: rgba(52,211,153,0.12);  color: var(--accent3); }
  .tag-medium { background: rgba(245,158,11,0.12);  color: var(--gold); }
  .tag-hard   { background: rgba(248,113,113,0.12); color: var(--danger); }
  .card-role-row { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; flex-wrap: wrap; }
  .card-role    { font-size: 13.5px; font-weight: 600; color: var(--accent); display: flex; align-items: center; gap: 6px; }
  .card-company { font-size: 12px; color: var(--muted); display: flex; align-items: center; gap: 4px; }
  .card-company::before { content: '·'; color: rgba(255,255,255,0.15); }
  .card-topic-badge { display: inline-block; padding: 2px 10px; border-radius: 20px; background: rgba(167,139,250,0.12); border: 1px solid rgba(167,139,250,0.2); font-size: 11px; color: var(--accent2); font-weight: 500; margin-bottom: 12px; }
  .card-body { font-size: 13.5px; line-height: 1.7; color: #b0b8cc; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; margin-bottom: 16px; }
  .card-footer { display: flex; align-items: center; justify-content: space-between; padding-top: 14px; border-top: 1px solid var(--card-border); }
  .likes-btn { display: flex; align-items: center; gap: 6px; background: transparent; border: 1px solid var(--card-border); border-radius: 20px; padding: 5px 12px; color: var(--muted); font-family: 'Outfit', sans-serif; font-size: 12px; cursor: pointer; transition: all 0.18s; }
  .likes-btn:hover { border-color: var(--rose); color: var(--rose); }
  .likes-btn.liked { border-color: var(--rose); color: var(--rose); background: rgba(244,114,182,0.08); }
  .read-more { font-size: 12px; color: var(--accent); font-weight: 500; cursor: pointer; transition: color 0.15s; background: none; border: none; font-family: 'Outfit', sans-serif; padding: 0; }
  .read-more:hover { color: var(--accent2); }

  /* Detail Modal */
  .detail-overlay { position: fixed; inset: 0; z-index: 9999; background: rgba(0,0,0,0.78); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; padding: 20px; animation: overlayIn 0.25s ease; }
  @keyframes overlayIn { from { opacity: 0; } to { opacity: 1; } }
  .detail-modal { background: var(--card); border: 1px solid var(--card-border); border-radius: var(--radius); width: 100%; max-width: 620px; max-height: 88vh; overflow-y: auto; position: relative; animation: modalUp 0.3s cubic-bezier(0.34,1.3,0.64,1); }
  @keyframes modalUp { from { opacity: 0; transform: translateY(32px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }

  .detail-modal-bar { height: 3px; border-radius: var(--radius) var(--radius) 0 0; }
  .bar-blue   { background: linear-gradient(90deg, var(--accent), var(--accent2)); }
  .bar-violet { background: linear-gradient(90deg, var(--accent2), var(--rose)); }
  .bar-green  { background: linear-gradient(90deg, var(--accent3), var(--accent)); }
  .bar-gold   { background: linear-gradient(90deg, var(--gold), var(--rose)); }

  .detail-modal-header { padding: 22px 26px 18px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--card-border); }
  .detail-modal-user { display: flex; align-items: center; gap: 12px; }
  .detail-avatar-lg { width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 700; color: white; flex-shrink: 0; }
  .detail-name { font-size: 15px; font-weight: 600; }
  .detail-date { font-size: 12px; color: var(--muted); margin-top: 2px; }
  .detail-close { width: 34px; height: 34px; border-radius: 50%; border: 1px solid var(--card-border); background: var(--surface2); color: var(--muted); font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: border-color 0.15s, color 0.15s; flex-shrink: 0; }
  .detail-close:hover { border-color: var(--danger); color: var(--danger); }

  .detail-modal-body { padding: 24px 26px 28px; }
  .detail-meta-row { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; margin-bottom: 14px; }
  .detail-role { font-size: 14px; font-weight: 600; color: var(--accent); display: flex; align-items: center; gap: 6px; }
  .detail-company { font-size: 13px; color: var(--muted); display: flex; align-items: center; gap: 4px; }
  .detail-company::before { content: '·'; color: rgba(255,255,255,0.15); }
  .detail-diff-tag { padding: 3px 11px; border-radius: 20px; font-size: 11px; font-weight: 700; }
  .detail-topic-badge { display: inline-flex; align-items: center; padding: 4px 12px; border-radius: 20px; background: rgba(167,139,250,0.12); border: 1px solid rgba(167,139,250,0.2); font-size: 12px; color: var(--accent2); font-weight: 500; margin-bottom: 20px; }

  .detail-section-label { font-size: 10.5px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
  .detail-section-label::after { content: ''; flex: 1; height: 1px; background: var(--card-border); }
  .detail-experience-text { font-size: 14.5px; line-height: 1.85; color: #c8d0e0; white-space: pre-wrap; }

  .detail-modal-footer { padding: 16px 26px 22px; border-top: 1px solid var(--card-border); display: flex; align-items: center; justify-content: space-between; }
  .detail-likes-btn { display: flex; align-items: center; gap: 7px; background: transparent; border: 1px solid var(--card-border); border-radius: 20px; padding: 7px 16px; color: var(--muted); font-family: 'Outfit', sans-serif; font-size: 13px; cursor: pointer; transition: all 0.18s; }
  .detail-likes-btn:hover { border-color: var(--rose); color: var(--rose); }
  .detail-likes-btn.liked { border-color: var(--rose); color: var(--rose); background: rgba(244,114,182,0.08); }
  .detail-quote-deco { font-family: 'Playfair Display', serif; font-size: 56px; color: rgba(79,142,247,0.08); line-height: 1; user-select: none; }

  /* Empty state */
  .empty-state { grid-column: 1/-1; text-align: center; padding: 60px 20px; display: flex; flex-direction: column; align-items: center; gap: 14px; }
  .empty-icon { width: 64px; height: 64px; border-radius: 18px; background: linear-gradient(135deg, var(--accent), var(--accent2)); display: flex; align-items: center; justify-content: center; font-size: 28px; box-shadow: 0 0 28px rgba(79,142,247,0.3); }
  .empty-state h3 { font-size: 18px; font-weight: 600; }
  .empty-state p { font-size: 13.5px; color: var(--muted); max-width: 320px; line-height: 1.6; }

  /* Skeleton */
  .skeleton-card { background: var(--card); border: 1px solid var(--card-border); border-radius: var(--radius); padding: 24px; }
  .skel { background: linear-gradient(90deg, var(--surface2) 25%, rgba(255,255,255,0.04) 50%, var(--surface2) 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 8px; }
  @keyframes shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }
  .skel-row { display: flex; gap: 12px; align-items: center; margin-bottom: 14px; }
  .skel-circle { width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0; }
  .skel-line { height: 12px; border-radius: 6px; }

  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 5px; }
`;

const MOCK = [
  { _id:"1", name:"Arjun Mehta",    company:"Flipkart",  role:"Frontend Developer",       topic:"React",                  difficulty:"Medium", experienceText:"I focused heavily on explaining my thought process while solving DSA problems. Interviewers here care more about your approach than the perfect answer. I practised STAR for behavioural rounds, which made a huge difference. The panel was impressed when I drew component diagrams before coding.", likes:34, createdAt:"May 30, 2025", color:"blue",   avatarColor:"av-blue",   avatarLetter:"A" },
  { _id:"2", name:"Priya Sharma",   company:"Google",    role:"Data Scientist",            topic:"ML / Python",            difficulty:"Hard",   experienceText:"The technical round had 3 stages — SQL, Python DS questions, and a case study. I structured my case study answer using the MECE principle. I kept explanations simple and used analogies for complex ML concepts. Always ask about the team's current stack — it shows genuine interest.", likes:58, createdAt:"May 27, 2025", color:"violet", avatarColor:"av-violet", avatarLetter:"P" },
  { _id:"3", name:"Kiran Rao",      company:"Amazon",    role:"Backend Engineer",          topic:"Node.js / System Design", difficulty:"Hard",   experienceText:"System design was the trickiest part. I clarified requirements before jumping in and estimated scale early. They appreciated when I acknowledged trade-offs honestly. For coding, clean and readable code with proper error handling mattered more than just code that works.", likes:41, createdAt:"May 25, 2025", color:"green",  avatarColor:"av-green",  avatarLetter:"K" },
  { _id:"4", name:"Sneha Patel",    company:"Razorpay",  role:"Full Stack Developer",      topic:"JavaScript",             difficulty:"Easy",   experienceText:"My interview was surprisingly conversational. The interviewer wanted to understand how I learn on the job. I walked through a real project, explained challenges with async data and state management, and how I solved them. Communication skills mattered as much as technical depth.", likes:22, createdAt:"May 22, 2025", color:"gold",   avatarColor:"av-gold",   avatarLetter:"S" },
  { _id:"5", name:"Rahul Nair",     company:"Atlassian", role:"DevOps Engineer",           topic:"Docker / Kubernetes",    difficulty:"Medium", experienceText:"They asked about incident scenarios — 'production is down, what do you do?' I structured answers around monitoring first, isolating the issue, then rolling back if needed. Knowing your infra tools deeply matters a lot. Cost optimisation strategies also really impressed the panel.", likes:29, createdAt:"May 20, 2025", color:"blue",   avatarColor:"av-blue",   avatarLetter:"R" },
  { _id:"6", name:"Divya Krishnan", company:"Swiggy",    role:"UI/UX Designer",            topic:"Design Thinking",        difficulty:"Easy",   experienceText:"The design interview had a portfolio review and a live challenge — redesign an ATM flow in 30 minutes. I verbalized my thinking throughout and asked clarifying questions about target users. They valued empathy-driven design over pixel-perfect work.", likes:47, createdAt:"May 17, 2025", color:"violet", avatarColor:"av-violet", avatarLetter:"D" },
];

const FILTERS = ["All", "Easy", "Medium", "Hard"];

export default function ExperiencePage() {
  const navigate = useNavigate();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [filter, setFilter]           = useState("All");
  const [search, setSearch]           = useState("");
  const [likedIds, setLikedIds]       = useState(new Set());
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get(`${API}/shareEx/interviews`, { withCredentials: true });
        setExperiences(Array.isArray(data) ? data : MOCK);
      } catch {
        setExperiences(MOCK);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = experiences.filter(e => {
    const matchDiff   = filter === "All" || e.difficulty === filter;
    const q           = search.toLowerCase();
    const matchSearch = !q ||
      e.role?.toLowerCase().includes(q)    ||
      e.topic?.toLowerCase().includes(q)   ||
      e.name?.toLowerCase().includes(q)    ||
      e.company?.toLowerCase().includes(q);
    return matchDiff && matchSearch;
  });

  const toggleLike = (id) => {
    setLikedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
    setExperiences(prev =>
      prev.map(e => e._id === id ? { ...e, likes: e.likes + (likedIds.has(id) ? -1 : 1) } : e)
    );
  };

  return (
    <>
      <style>{styles}</style>

      {/* Detail Modal */}
      {selectedItem && (
        <div
          className="detail-overlay"
          onClick={e => e.target === e.currentTarget && setSelectedItem(null)}
        >
          <div className="detail-modal">
            <div className={`detail-modal-bar bar-${selectedItem.color || "blue"}`} />

            <div className="detail-modal-header">
              <div className="detail-modal-user">
                <div className={`detail-avatar-lg ${selectedItem.avatarColor || "av-blue"}`}>
                  {selectedItem.avatarLetter || selectedItem.name?.[0]?.toUpperCase() || "U"}
                </div>
                <div>
                  <div className="detail-name">{selectedItem.name || "Anonymous"}</div>
                  <div className="detail-date">{selectedItem.createdAt}</div>
                </div>
              </div>
              <button className="detail-close" onClick={() => setSelectedItem(null)}>✕</button>
            </div>

            <div className="detail-modal-body">
              <div className="detail-meta-row">
                <div className="detail-role">💼 {selectedItem.role}</div>
                {selectedItem.company && <div className="detail-company">🏢 {selectedItem.company}</div>}
                <span className={`detail-diff-tag tag-${selectedItem.difficulty?.toLowerCase()}`}>
                  {selectedItem.difficulty}
                </span>
              </div>

              {selectedItem.topic && (
                <div className="detail-topic-badge">#{selectedItem.topic}</div>
              )}

              <div className="detail-section-label">Experience & Strategy</div>
              <p className="detail-experience-text">{selectedItem.experienceText}</p>
            </div>

            <div className="detail-modal-footer">
              <button
                className={`detail-likes-btn ${likedIds.has(selectedItem._id) ? "liked" : ""}`}
                onClick={() => toggleLike(selectedItem._id)}
              >
                {likedIds.has(selectedItem._id) ? "❤️" : "🤍"}
                {experiences.find(e => e._id === selectedItem._id)?.likes ?? selectedItem.likes} helpful
              </button>
              <div className="detail-quote-deco">"</div>
            </div>
          </div>
        </div>
      )}

      <div className="exp-root">
        <div className="grid-bg" />
        <div className="orb orb-a" />
        <div className="orb orb-b" />

        <div className="exp-content">
          {/* Topnav */}
          <nav className="topnav">
            <div className="brand" onClick={() => navigate("/dashboard")}>
              <div className="brand-gem">✦</div>
              <span className="brand-name">InterviewAI</span>
            </div>
            <div className="nav-pills">
              <button className="nav-pill" onClick={() => navigate("/dashboard")}>Dashboard</button>
              <button className="nav-pill active">Experience</button>
              <button className="nav-pill" onClick={() => navigate("/progress")}>Progress</button>
            </div>
          </nav>

          {/* Page header */}
          <div className="page-header">
            <div className="ph-left">
              <h1>Community <span>Experiences</span></h1>
              <p>Real strategies from real interviews — learn what actually works.</p>
            </div>
            <button className="add-btn" onClick={() => navigate("/shareExperience")}>
              ✦ Share Your Experience
            </button>
          </div>

          {/* Stats */}
          <div className="stats-bar">
            <div className="stat-card">
              <div className="stat-icon icon-blue">📝</div>
              <div className="stat-info">
                <div className="snum">{experiences.length}</div>
                <div className="slbl">Experiences Shared</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon icon-violet">❤️</div>
              <div className="stat-info">
                <div className="snum">{experiences.reduce((a, e) => a + (e.likes || 0), 0)}</div>
                <div className="slbl">Total Likes</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon icon-green">🏢</div>
              <div className="stat-info">
                <div className="snum">{new Set(experiences.map(e => e.company).filter(Boolean)).size}</div>
                <div className="slbl">Companies Covered</div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="filters-row">
            <div className="search-wrap">
              <span className="search-icon">🔍</span>
              <input
                className="search-input"
                placeholder="Search by role, company, topic or name…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            {FILTERS.map(f => (
              <button key={f} className={`filter-pill ${filter === f ? "active-pill" : ""}`} onClick={() => setFilter(f)}>
                {f}
              </button>
            ))}
          </div>

          {/* Cards */}
          <div className="cards-grid">
            {loading ? (
              [1,2,3].map(i => (
                <div className="skeleton-card" key={i}>
                  <div className="skel-row">
                    <div className="skel skel-circle" />
                    <div style={{ flex:1, display:"flex", flexDirection:"column", gap:8 }}>
                      <div className="skel skel-line" style={{ width:"60%" }} />
                      <div className="skel skel-line" style={{ width:"40%" }} />
                    </div>
                  </div>
                  <div className="skel skel-line" style={{ marginBottom:8 }} />
                  <div className="skel skel-line" style={{ width:"80%", marginBottom:8 }} />
                  <div className="skel skel-line" style={{ width:"65%" }} />
                </div>
              ))
            ) : filtered.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3>No experiences found</h3>
                <p>Try adjusting your search or filters, or be the first to share your experience!</p>
                <button className="add-btn" onClick={() => navigate("/shareExperience")}>✦ Share Yours</button>
              </div>
            ) : (
              filtered.map((item, idx) => (
                <div
                  key={item._id}
                  className={`exp-card color-${item.color || "blue"}`}
                  style={{ animationDelay: `${idx * 0.06}s` }}
                >
                  <div className="quote-deco">"</div>
                  <div className="card-top">
                    <div className={`user-avatar ${item.avatarColor || "av-blue"}`}>
                      {item.avatarLetter || item.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div className="user-meta">
                      <div className="uname">{item.name || "Anonymous"}</div>
                      <div className="udate">{item.createdAt}</div>
                    </div>
                    <span className={`diff-tag tag-${item.difficulty?.toLowerCase()}`}>
                      {item.difficulty}
                    </span>
                  </div>

                  <div className="card-role-row">
                    <div className="card-role">💼 {item.role}</div>
                    {item.company && <div className="card-company">🏢 {item.company}</div>}
                  </div>

                  {item.topic && <div className="card-topic-badge">#{item.topic}</div>}

                  <div className="card-body">{item.experienceText}</div>

                  <div className="card-footer">
                    <button
                      className={`likes-btn ${likedIds.has(item._id) ? "liked" : ""}`}
                      onClick={() => toggleLike(item._id)}
                    >
                      {likedIds.has(item._id) ? "❤️" : "🤍"} {item.likes}
                    </button>
                    <span className="read-more" onClick={() => setSelectedItem(item)}>Read more →</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}