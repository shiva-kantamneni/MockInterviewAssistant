// models/Session.js
const mongoose = require("mongoose");

// ── Individual message ────────────────────────────────────────────────────────
const MessageSchema = new mongoose.Schema(
  {
    role:    { type: String, enum: ["ai", "user"], required: true },
    content: { type: String, required: true },
    time:    { type: String },               // display string e.g. "02:45 PM"
  },
  { _id: false }                             // no separate _id per message
);

// ── Interview Session ─────────────────────────────────────────────────────────
const SessionSchema = new mongoose.Schema(
  {
    userId: {
      type:     mongoose.Schema.Types.ObjectId,
      ref:      "User",
      required: true,
      index:    true,                        // fast lookup by user
    },
    title:    { type: String, default: "Interview Session" },
    icon:     { type: String, default: "💼" },
    fileName: { type: String, default: "" }, // resume file name if uploaded
    messages: { type: [MessageSchema], default: [] },
  },
  {
    timestamps: true,                        // adds createdAt + updatedAt automatically
  }
);

module.exports = mongoose.model("Session", SessionSchema);