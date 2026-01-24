require("dotenv").config();
const express = require("express");
const axios = require("axios");
const router = express.Router();

router.post("/generate-questions", async (req, res) => {
  const { Topic, role, difficulty = "intermediate", number = 5 } = req.body;

  const prompt = `You are an AI interview assistant.Each question should be relevant, clear, and challenging. Generate ${number} ${difficulty} level interview questions for the topic and role: ${role} and ${Topic}.Generate three questions on Role and two on topic and dont give separately. Only return the questions as a numbered list.`;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`, // Use env var!
          "Content-Type": "application/json",
        },
      }
    );

    const content = response.data.choices[0].message.content;

    // ✅ Parse questions from string to array
    const questions = content
      .split('\n')
      .filter(line => line.trim().match(/^\d+\./)) // lines like "1. ..."
      .map(line => line.replace(/^\d+\.\s*/, ''));  // remove "1. "

    res.json({ questions });
  } catch (error) {
    console.error(error?.response?.data || error.message);
    res.status(500).json({ error: "Failed to generate questions" });
  }
});

module.exports = router;
