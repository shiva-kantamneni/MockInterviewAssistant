// routes/history.js  (API/history.js)
require("dotenv").config();
const express = require("express");
const router  = express.Router();
const jwt     = require("jsonwebtoken");
const Session = require("../Models/session");

// ── Auth middleware ────────────────────────────────────────────────────────────
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }
  try {
    const decoded = jwt.verify(
      authHeader.split(" ")[1],
      process.env.JWT_SECRET || "secret"
    );

    // FIX 1: log so you can see the exact key name in your terminal
    console.log("JWT decoded payload:", decoded);

    // Support every common key name
    req.userId =
      decoded.id       ||
      decoded._id      ||
      decoded.userId   ||
      decoded.sub      ||
      decoded.user?.id ||
      decoded.user?._id;

    if (!req.userId) {
      console.error("userId missing in JWT. Full payload:", decoded);
      return res.status(401).json({ error: "Token missing user id — check your sign() call" });
    }

    next();
  } catch (err) {
    console.error("JWT verify error:", err.message);
    res.status(401).json({ error: "Invalid token" });
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function pickIcon(title = "") {
  const t = title.toLowerCase();
  if (t.includes("react") || t.includes("frontend"))  return "⚛️";
  if (t.includes("system") || t.includes("design"))   return "🏗️";
  if (t.includes("javascript") || t.includes("js"))   return "🟨";
  if (t.includes("python"))                            return "🐍";
  if (t.includes("resume"))                            return "📝";
  if (t.includes("backend") || t.includes("node"))    return "🖥️";
  if (t.includes("data"))                              return "📊";
  return "💼";
}

function deriveTitle(messages = [], fileName = "") {
  if (fileName) return fileName.replace(/\.(pdf|docx)$/i, "") + " Interview";
  const first = messages.find((m) => m.role === "ai");
  if (!first) return "Interview Session";
  return first.content.split(" ").slice(0, 6).join(" ") + "…";
}

function relativeMeta(date, msgCount) {
  const diff  = Date.now() - new Date(date).getTime();
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

// ── GET /history/sessions ─────────────────────────────────────────────────────
router.get("/sessions", authenticate, async (req, res) => {
  try {
    console.log("Fetching sessions for userId:", req.userId);

    const raw = await Session.find({ userId: req.userId })
      .sort({ updatedAt: -1 })
      .select("title icon fileName messages updatedAt")
      .lean();

    console.log(`Found ${raw.length} sessions`);

    const sessions = raw.map((s) => ({
      id:       s._id.toString(),  // FIX 4: always plain string
      icon:     s.icon,
      title:    s.title,
      meta:     relativeMeta(s.updatedAt, s.messages.length),
      fileName: s.fileName,
    }));

    res.json({ sessions });
  } catch (err) {
    console.error("GET /sessions error:", err);
    res.status(500).json({ error: "Failed to fetch sessions", detail: err.message });
  }
});

// ── GET /history/sessions/:id ─────────────────────────────────────────────────
router.get("/sessions/:id", authenticate, async (req, res) => {
  try {
    const session = await Session.findOne({
      _id:    req.params.id,
      userId: req.userId,
    }).lean();

    if (!session) return res.status(404).json({ error: "Session not found" });

    res.json({ session: { ...session, id: session._id.toString() } });
  } catch (err) {
    console.error("GET /sessions/:id error:", err);
    res.status(500).json({ error: "Failed to load session", detail: err.message });
  }
});

// ── POST /history/sessions ────────────────────────────────────────────────────
router.post("/sessions", authenticate, async (req, res) => {
  try {
    const { messages = [], fileName = "" } = req.body;
    console.log("Creating session for userId:", req.userId, "msgs:", messages.length);

    const title = deriveTitle(messages, fileName);
    const session = await Session.create({
      userId:   req.userId,
      title,
      icon:     pickIcon(title),
      fileName,
      messages,
    });

    console.log("Created session:", session._id.toString());

    res.status(201).json({
      sessionId: session._id.toString(),  // FIX 4: plain string
      title:     session.title,
      icon:      session.icon,
    });
  } catch (err) {
    console.error("POST /sessions error:", err);
    res.status(500).json({ error: "Failed to create session", detail: err.message });
  }
});

// ── PATCH /history/sessions/:id ───────────────────────────────────────────────
router.patch("/sessions/:id", authenticate, async (req, res) => {
  try {
    const { messages, fileName } = req.body;

    // FIX 2: pass fileName so title stays correct on updates
    const title = deriveTitle(messages, fileName);

    const session = await Session.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { messages, title, icon: pickIcon(title) },
      { new: true }
    );

    if (!session) return res.status(404).json({ error: "Session not found" });
    res.json({ ok: true, title: session.title });
  } catch (err) {
    console.error("PATCH /sessions/:id error:", err);
    res.status(500).json({ error: "Failed to update session", detail: err.message });
  }
});

// ── DELETE /history/sessions/:id ─────────────────────────────────────────────
router.delete("/sessions/:id", authenticate, async (req, res) => {
  try {
    const result = await Session.findOneAndDelete({
      _id:    req.params.id,
      userId: req.userId,
    });

    if (!result) return res.status(404).json({ error: "Session not found" });
    res.json({ ok: true });
  } catch (err) {
    console.error("DELETE /sessions/:id error:", err);
    res.status(500).json({ error: "Failed to delete session", detail: err.message });
  }
});

module.exports = router;