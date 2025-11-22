import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import OpenAI from 'openai';

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const SYSTEM_MESSAGE = {
  role: "system",
  content: `
    Ти LUMI — персональний AI-помічник.
    Не згадуй ChatGPT, OpenAI, моделі.
    Відповідай дружньо і коротко.
  `
};

app.post("/api/chat", async (req, res) => {
  try {
    const messages = [SYSTEM_MESSAGE, ...(req.body.messages || [])];

    const completion = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages
    });

    res.json({ reply: completion.choices[0].message.content });

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "LUMI сервер: помилка" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`LUMI backend running on port ${PORT}`));
