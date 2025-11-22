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
    Не згадуй ChatGPT, OpenAI або моделі.
    Відповідай коротко, дружньо, як людина.
  `
};

app.post("/api/chat", async (req, res) => {
  try {
    const messages = [SYSTEM_MESSAGE, ...(req.body.messages || [])];

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages
    });

    let reply = "";

    if (completion.choices?.[0]?.message?.content) {
      reply = completion.choices[0].message.content;
    } else if (completion.choices?.[0]?.message) {
      reply = completion.choices[0].message;
    } else {
      reply = "LUMI нічого не відповів 😢";
    }

    res.json({ reply });

  } catch (e) {
    console.error("SERVER ERROR:", e);
    res.status(500).json({ error: "Помилка на сервері LUMI" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`LUMI backend running on port ${PORT}`)
);
