import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Groq from 'groq-sdk';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

let conversationHistory = [
    {
        role: "system",
        content: "Você é o PATOLÓGICO, um assistente virtual especialista em estudos, focado em patologia e ciências da saúde. Seja didático, direto, inteligente e encorajador."
    }
];

app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'A mensagem não pode estar vazia.' });
        }

        conversationHistory.push({ role: "user", content: message });

        const completion = await groq.chat.completions.create({
            messages: conversationHistory,
            model: "openai/gpt-oss-20b",
            temperature: 0.7,
            max_tokens: 1024,
        });

        const reply = completion.choices[0]?.message?.content || "Não consegui gerar uma resposta.";

        conversationHistory.push({ role: "assistant", content: reply });

        res.json({ reply });
    } catch (error) {
        console.error('Erro na API da Groq:', error);
        res.status(500).json({ error: 'Erro ao processar sua requisição no servidor.' });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
    console.log(`Servidor rodando com sucesso na porta ${port}`);
});
