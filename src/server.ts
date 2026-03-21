import express from 'express';
import prisma from './config/database.js';
import { createUserSchema } from './validations/user.schema.js';

const app = express();
const PORT = 3000;

// --- MIDDLEWARES ---
app.use(express.json());

// --- ROUTES (Health Checks) ---

app.get('/ping', async (req, res) => {
  res.status(200).json({ 
    status: 'success', 
    message: 'API is running' });
});

app.get('/test-db', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json({ 
      status: 'success', 
      data: users });
  } catch (error) {
    console.error('[DB_ERROR] Failed to connect:', error); 
    res.status(500).json({ 
      status: 'error', 
      message: 'Internal server error' });
  }
});

// --- USERS ROUTES (POST) ---

app.post('/users', async (req, res) => {
  const validation = createUserSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid data. Please check the provided information.',
      errors: validation.error.issues.map(issue => ({
        campo: issue.path,
        mensagem: issue.message
      }))
    });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: validation.data.email}
    });

    if (existingUser) {
      return res.status(409).json({
        status: 'error',
        message: 'This email is already in use.'
      });
    }

    const newUser = await prisma.user.create({
      data: validation.data
    });

    res.status(201).json({
      status: 'success',
      data: newUser
    });

  } catch (error) {
    console.error('[DB_ERROR] Error creating user:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Internal server error.'
    });
  }
})

// --- ROTA PARA LISTA USUÁRIOS (GET) ---

app.get('/users', async (req, res) => {
  try{
    const users = await prisma.user.findMany();
    res.status(200).json({ 
      status: 'success', 
      data: users });

  } catch (error) {
    console.error('[DB_ERROR] Error fetching users:', error);
    res.status(500).json({ 
      status: 'error', 
      message: 'Erro ao buscar usuário' });
  }
})

// --- ROTA PARA DELETAR USUÁRIO (DELETE) ---

app.delete('/users/:id', async (req, res) => {
  try{
    const { id } = req.params;
    await prisma.user.delete({
      where: {
        id: id,
      },
    });
    res.status(200).json({ status: 'success', message: 'User deleted successfully.' });

  } catch (error) {
    console.error('[DB_ERROR] Erro ao deletar  usuário:', error);
    // Retornamos 400 (Bad Resquest) caso o ID não exista no banco
    res.status(400).json({ status: 'error', message: 'Error deleting user. Verify the provided ID.' });
  }
});

// --- ROTA PARA ATUALIZAR USUÁRIO (PUT) ---

app.put('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;
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
    res.status(200).json({ stauts: 'success', data: updateUser });

  } catch (error) {
    console.error('[DB_ERROR] Error updating user:', error);
    res.status(400).json({ status: 'error', message: 'Error updating user. Please check the provided data.' });
  }
});

// --- SERVER INITIALIZATION ---

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});