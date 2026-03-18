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

// --- ROTA DE CRIAÇÃO DE USUÁRIO (POST) ---

app.post('/users', async (req, res) => {
  try {
    // 1. O Express pega as informações que chegaram no "corpo" da requisição (JSON)
    const { name, email, password } = req.body;
    // 2. O Prisma vai até o PostegreSQL e cria uma nova linha na tabela User
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password, // Em um projeto real, nós criptografaríamos essa senha antes de salvar!
      },
    });
    // 3. Retornamos o status 201 (Created) e os dados do usuário recém-criado
    res.status(201).json({ status: 'sucess', data: newUser });

  } catch (error) {
    console.error('[DB_ERROR] Erro ao criar usuário:', error);
    // Retornamos status 400 (Bad Request) se der erro (ex: email já cadastrado)
    res.status(400).json({ status: 'error', message: 'Erro ao criar usuário' });
  }
})

// --- ROTA PARA LISTA USUÁRIOS (GET) ---

app.get('/users', async (req, res) => {
  try{
    // 1. O Prisma busca todos os registros na tabela User
    const users = await prisma.user.findMany();
    // 2. Retornamos status 200 (OK) e a lista de usuários
    res.status(200).json({ status: 'success', data: users });

  } catch (error) {
    console.error('[DB_ERROR] Erro ao buscar usuário:', error);
    res.status(500).json({ status: 'error', message: 'Erro ao buscar usuário' });
  }
})

// --- ROTA PARA DELETAR USUÁRIO (DELETE) ---

app.delete('/users/:id', async (req, res) => {
  try{
    // 1. Pegamos o ID que vem direto da URL (ex: /users/123)
    const { id } = req.params;
    // 2. O Prisma vai até o banco e deleta a linha exata que tem esse ID
    await prisma.user.delete({
      where: {
        id: id,
      },
    });
    // 3. Retornamos status 200 (ok) avisando que deu tudo certo
    res.status(200).json({ status: 'success', message: 'Usuário deletado com sucesso!' });

  } catch (error) {
    console.error('[DB_ERROR] Erro ao deletar  usuário:', error);
    // Retornamos 400 (Bad Resquest) caso o ID não exista no banco
    res.status(400).json({ status: 'error', message: 'Erro ao deletar usuário. Verifique se o ID está correto.' });
  }
});

// --- ROTA PARA ATUALIZAR USUÁRIO (PUT) ---

app.put('/users/:id', async (req, res) => {
  try {
    // 1. Pegamos o ID da URL para saber QUEM atualizar
    const { id } = req.params;
    //2. Pegamos os novos dados do corpo da requisição
    const { name, email, password } = req.body;
    // 3. O Prisma vai até o banco, acha o usuário pelo ID e substitui os dados
    const updateUser = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        name,
        email,
        password,
      },
    });
    // 4. Retornamos o usuário atualizado!
    res.status(200).json({ stauts: 'success', data: updateUser });

  } catch (error) {
    console.error('[DB_ERROR] Erro ao atualizar usuário', error);
    res.status(400).json({ status: 'error', message: 'Erro ao atualizar usuário. Verifique os dados.' });
  }
});

// --- SERVER INITIALIZATION ---

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});