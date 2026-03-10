require("dotenv").config();
const express = require("express");
const axios = require("axios");
const router = express.Router();
const multer = require("multer");
const pdfParse = require("pdf-parse/lib/pdf-parse.js");
const upload = multer({ dest: "uploads/" });
const fs = require("fs");
const { GoogleGenAI } = require("@google/genai");

console.log("KEY:", process.env.GEMINI_API_KEY);
const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);

// ── Shared OpenRouter helper ──────────────────────────────────────────────────
async function askOpenRouter(prompt, model = "meta-llama/llama-3-8b-instruct") {
  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model,
      messages: [{ role: "user", content: prompt }],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data.choices[0].message.content;
}

// ── Upload & parse resume ─────────────────────────────────────────────────────
router.post("/upload-resume", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file received. Check field name is 'resume'." });
    }

    const filePath = req.file.path;
    const fileType = req.file.mimetype;
    let text = "";

    console.log("Received file:", req.file.originalname, "| Type:", fileType, "| Path:", filePath);

    if (fileType === "application/pdf") {
      try {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(dataBuffer);
        text = data.text;
      } catch (pdfErr) {
        console.error("PDF parse error:", pdfErr.message);
        return res.status(422).json({ error: "Failed to parse PDF: " + pdfErr.message });
      }
    } else if (
      fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      try {
        const result = await mammoth.extractRawText({ path: filePath });
        text = result.value;
      } catch (docErr) {
        console.error("DOCX parse error:", docErr.message);
        return res.status(422).json({ error: "Failed to parse DOCX: " + docErr.message });
      }
    } else {
      return res.status(415).json({ error: `Unsupported file type: ${fileType}` });
    }

    try { fs.unlinkSync(filePath); } catch (_) {}

    if (!text || text.trim().length === 0) {
      return res.status(422).json({ error: "File parsed but no text could be extracted." });
    }

    res.json({ text });
  } catch (error) {
    console.error("Upload route error:", error);
    res.status(500).json({ error: "Text extraction failed", detail: error.message });
  }
});

// ── Resume → first interview question ────────────────────────────────────────
router.post("/process-resume", async (req, res) => {
  const { resumeText } = req.body;

  const prompt = `
You are a conversational AI interview assistant.

Based on the following resume generate interview questions
from easy to medium difficulty.

Return ONLY numbered questions.

Resume:
${resumeText}
`;

  try {
    const content = await askOpenRouter(prompt);

    const questions = content
      .split("\n")
      .filter((line) => line.trim().match(/^\d+\./))
      .map((line) => line.replace(/^\d+\.\s*/, "").trim());

    res.json({ questions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate questions" });
  }
});

// ── START INTERVIEW (topic/role mode) ─────────────────────────────────────────
// Called once by ChatScreen when the user comes from StartInterviewForm.
// Returns a single opening question tailored to the topic, role, and optional
// custom question the user provided.
router.post("/start-interview", async (req, res) => {
  const { topic, role, customQuestion } = req.body;

  if (!topic && !role) {
    return res.status(400).json({ error: "At least one of topic or role is required." });
  }

  const customPart = customQuestion
    ? `The candidate has also requested this specific question be included: "${customQuestion}". Start with it or naturally work it in early.`
    : "";

  const prompt = `
You are a professional AI technical interviewer conducting a mock interview.

The candidate is applying for the role of: ${role || "a software professional"}
The interview topic/focus is: ${topic || "general software engineering"}
${customPart}

Start the interview with a single, natural, conversational opening question.
- Do NOT greet with "Hello" or "Welcome" — jump straight into the question.
- Keep it relevant to the role and topic.
- Ask only ONE question.
- Do not number it or add any preamble.
`;

  try {
    const question = await askOpenRouter(prompt);
    res.json({ question: question.trim() });
  } catch (error) {
    console.error("start-interview error:", error?.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate opening question" });
  }
});

// ── CHAT (ongoing conversation) ───────────────────────────────────────────────
// Called by ChatScreen for every user message after the interview has started.
// Accepts full conversation history + interview context so the AI stays on track.
router.post("/chat", async (req, res) => {
  const {
    userMessage,
    conversationHistory = [],
    // Resume mode context
    resumeText = "",
    // Topic/role mode context
    topic = "",
    role = "",
    customQuestion = "",
  } = req.body;

  if (!userMessage) {
    return res.status(400).json({ error: "userMessage is required." });
  }

  // Build a context block describing the interview setup
  let contextBlock = "";
  if (resumeText) {
    contextBlock = `
You are interviewing a candidate based on their resume. Here is the resume:
---
${resumeText.slice(0, 3000)}   
---
Ask relevant follow-up questions based on their background and answers.
`;
  } else if (topic || role) {
    contextBlock = `
You are a professional AI technical interviewer.
Role being interviewed for: ${role || "software professional"}
Topic / focus area: ${topic || "general software engineering"}
${customQuestion ? `The candidate requested this topic be included: "${customQuestion}"` : ""}

Keep your questions focused on the role and topic above.
`;
  } else {
    contextBlock = `You are a conversational AI interview assistant. Ask relevant interview questions and evaluate the candidate's answers.`;
  }

  // Format conversation history into a readable transcript for the prompt
  const historyText = conversationHistory
    .slice(-10) // keep last 10 messages to avoid token overflow
    .map((m) => `${m.role === "ai" ? "Interviewer" : "Candidate"}: ${m.content}`)
    .join("\n");

  const prompt = `
${contextBlock}

Previous conversation:
${historyText || "(No previous messages)"}

Candidate just said:
"${userMessage}"

Instructions:
- Evaluate the candidate's answer briefly (1-2 sentences max).
- Then ask ONE clear follow-up interview question.
- Stay on the topic and role.
- Do NOT list multiple questions.
- Do NOT use bullet points or numbered lists.
- Keep the tone professional but conversational.
`;

  try {
    const reply = await askOpenRouter(prompt);
    res.json({ reply: reply.trim() });
  } catch (error) {
    console.error("chat error:", error?.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate response" });
  }
});

// ── Upload audio answer → transcribe + evaluate ───────────────────────────────
router.post("/upload-answer", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio received" });
    }

    const filePath = req.file.path;
    const question = req.body.question;

    const audioBuffer = fs.readFileSync(filePath);

    // Step 1: Transcribe with Gemini
    const transcription = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [
            { text: "Transcribe this interview answer clearly." },
            {
              inlineData: {
                mimeType: req.file.mimetype || "audio/webm",
                data: audioBuffer.toString("base64"),
              },
            },
          ],
        },
      ],
    });

    const transcript = transcription.text.trim();

    // Step 2: Evaluate with OpenRouter
    const evaluationPrompt = `
You are an AI technical interviewer.

Question:
${question}

Candidate Answer:
${transcript}

Evaluate the answer and return:

Score (out of 10)
Strengths
Improvements
Next interview question
`;

    const aiResponse = await askOpenRouter(evaluationPrompt);

    fs.unlinkSync(filePath);

    res.json({ transcript, aiResponse });
  } catch (error) {
    console.error("Upload Answer Error:", error);
    res.status(500).json({ error: "Failed to process audio answer" });
  }
});

// ── Generate questions (standalone utility) ───────────────────────────────────
router.post("/generate-questions", async (req, res) => {
  const { Topic, role, difficulty = "intermediate", number = 5 } = req.body;

  const prompt = `You are an AI interview assistant. Each question should be relevant, clear, and challenging. Generate ${number} ${difficulty} level interview questions for the topic and role: ${role} and ${Topic}. Generate three questions on Role and two on topic and dont give separately. Only return the questions as a numbered list.`;

  try {
    const content = await askOpenRouter(prompt, "mistralai/mistral-7b-instruct");

    const questions = content
      .split("\n")
      .filter((line) => line.trim().match(/^\d+\./))
      .map((line) => line.replace(/^\d+\.\s*/, ""));

    res.json({ questions });
  } catch (error) {
    console.error(error?.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate questions" });
  }
});

module.exports = router;