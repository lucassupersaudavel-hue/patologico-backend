require('dotenv').config()
import express from 'express';
import cors from 'cors';
import { Groq } from 'groq-sdk';

const app = express();

// 🔓 Essencial: Libera o CORS para o 8080 conseguir conversar com o 5000
app.use(cors({
  origin: 'http://127.0.0.1:8080'
}));
app.use(express.json());

// 🔑 Configuração da Groq
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// 🧠 Rota que vai processar a pergunta
app.post('/api/perguntar', async (req, res) => {
  const { pergunta, nivel } = req.body; // 🔍 Aqui está como "pergunta"
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: `Você é o PATOLÓGICO, uma IA de Biologia para o nível: ${nivel}.` },
        { role: 'user', content: pergunta } // 🔍 Mude de "pregunta" para "pergunta"
      ],
      model: 'llama-3.3-70b-versatile',
    });
    res.json({ resposta: chatCompletion.choices[0]?.message?.content || "Sem resposta." });
  } catch (error) {
    console.error("Erro na Groq:", error);
    res.status(500).json({ error: 'Erro interno na IA.' });
  }
});

app.listen(3000, '127.0.0.1', () => {
  console.log('API DO PATOLÓGICO ATIVA NA PORTA 3000 🚀');
});

