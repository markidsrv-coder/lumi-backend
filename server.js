import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM = {
  role: "system",
  content: `
    Ти LUMI — дружній AI-помічник.
    Говори тепло, по-людськи, коротко.
    Не згадуй ChatGPT або OpenAI.
  `
};

app.post("/api/chat", async (req, res) => {
  try {
    const userMessages = req.body.messages || [];

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [SYSTEM, ...userMessages]
    });

    const reply = response.choices[0].message.content;
    res.json({ reply });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ error: "Помилка LUMI сервера" });
  }
});

app.listen(10000, () => {
  console.log("LUMI backend running on port 10000");
});
