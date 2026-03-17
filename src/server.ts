import express from 'express'
import prisma from './config/database.js'

const app = express();
const PORT = 3000;

// --- MIDDLEWARES ---
// Permite que o Express entenda requisições com corpo no formato JSON
app.use(express.json());

// --- ROUTES (Health Checks) ---

app.get('/ping', async (req, res) => {
  // Retorno limpo e padronizado para o cliente
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

app.get('/test-db', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json({ status: 'success', data: users });
  } catch (error) {
    // Log detalhado para o desenvolvedor ver no terminal
    console.error('[DB_ERROR] Falha ao conectar:', error); 
    // Resposta genérica e segura para o usuário final
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// --- SERVER INITIALIZATION ---

app.listen(PORT, () => {
  // Aqui o emoji é super útil para o desenvolvedor achar o link rápido no terminal
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});