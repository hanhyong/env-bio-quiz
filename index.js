// index.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// OpenAI 설정
const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY
}));

// 서술형 채점 엔드포인트
app.post('/api/grade', async (req, res) => {
  const { question, expected, answer } = req.body;
  const prompt =
    `Question: ${question}\n` +
    `Key points: ${expected.join(', ')}\n` +
    `Student answer: ${answer}\n` +
    `위 학생 답변이 핵심 키포인트를 포함하고 있으면 "yes", 그렇지 않으면 "no"만 대답하세요.`;
  try {
    const completion = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt,
      max_tokens: 5,
      temperature: 0
    });
    const reply = completion.data.choices[0].text.trim().toLowerCase();
    res.json({ correct: reply.startsWith('y') });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'grading failed' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
