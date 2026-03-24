import express from 'express';
import prisma from './config/database.js';
import { createUserSchema, updateUserSchema } from './validations/user.schema.js';
import { createTaskSchema, updateTaskSchema } from './validations/task.schema.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

export const app = express();
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

    const hashedPassword = await bcrypt.hash(validation.data.password, 10);

    const newUser = await prisma.user.create({
      data: {
        ...validation.data,
        password: hashedPassword
      }
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

// --- ROTA DE LOGIN (POST) ---

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'E-mail ou senha inválidos.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ status: 'error', message: 'E-mail ou senha inválidos.'});
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'minha_chave_super_secreta_123',
      { expiresIn: '1h' }
    );

    res.status(200).json({ status: 'success', token });

  } catch (error) {
    console.error('[DB_ERROR] Error logging in:', error)
    res.status(500).json({ status: 'error', message: 'Erro interno ao fazer login.' })
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
    res.status(400).json({ status: 'error', message: 'Error deleting user. Verify the provided ID.' });
  }
});

// --- UPDATE ROUTES (PUT) ---

app.put('/users/:id', async (req, res) => {
  const validation = updateUserSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid data provided.',
      errors: validation.error.issues.map(issue => ({
        field: issue.path,
        message: issue.message
      }))
    });
  }

  try {
    const { id } = req.params;
    
    const updateUser = await prisma.user.update({
      where: { id: id },
      data: validation.data as any,
    });
    
    res.status(200).json({ status: 'success', data: updateUser });
  } catch (error) {
    console.error('[DB_ERROR] Error updating user:', error);
    res.status(400).json({ status: 'error', message: 'Error updating user. Verify the ID and data.' });
  }
});

// --- TASKS ROUTES ---

app.post('/tasks', async (req, res) => {
  const validation = createTaskSchema.safeParse(req.body);

  if(!validation.success) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid data. Please check the provided information.',
      errors: validation.error.issues.map(issue => ({
        field: issue.path,
        message: issue.message
      }))
    });
  }

  try {
    const userExists = await prisma.user.findUnique({
      where: { id: validation.data.userId }
    });

    if (!userExists) {
      return res.status(400).json({
        status: 'error',
        message: 'User not found. Cannot create task for a non-existent user.',
      });
    }

    const newTask = await prisma.task.create({
      data: validation.data as any
    });

    res. status(201).json({ status: 'success', data: newTask });

  } catch (error) {
    console.error('[DB_ERROR] Error creating task:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error.' });
  }
});

app.get('/users/:userId/tasks', async (req, res) => {
    try {
      const { userId } = req.params

      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const userTasks = await prisma.task.findMany({
        where: { userId: userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: skip
      });

      const totalTasks = await prisma.task.count({ where: { userId: userId } });
      const totalPages = Math.ceil(totalTasks / limit );

      res.status(200).json({ 
        status: 'success', 
        meta: {
          totalItems: totalTasks,
          currentPage: page,
          itemsPerPage: limit,
          totalPages: totalPages
        },
        data: userTasks});

    } catch (error) {
      console.error('[DB_ERROR] Error fetching user tasks:', error)
      res.status(500).json({ status: 'error', message: 'Error fetching user tasks.'});
    }
});

app.put('/tasks/:id', async (req, res) => {
  const validation = updateTaskSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid data. Please check the provided information.',
      errors: validation.error.issues.map(issue => ({
        field: issue.path,
        message: issue.message
      }))
    });
  }

  try {
    const { id } = req.params;
    
    const updatedTask = await prisma.task.update({
      where: { id: id },
      data: validation.data as any,
    });
    
    res.status(200).json({ status: 'success', data: updatedTask });
  } catch (error) {
    console.error('[DB_ERROR] Error updating task:', error);
    res.status(400).json({ status: 'error', message: 'Error updating task. Verify the ID and data.' });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.task.delete({
      where: { id: id },
    });
    res.status(200).json({ status: 'success', message: 'Task deleted successfully.'});

  } catch (error) {
    console.error('[DB_ERROR] Error deleting task:', error);
    res.status(400).json({ status: 'error', message: 'Error deleting task. Verify the provided ID.' });
  }
});

// --- SERVER INITIALIZATION ---

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
}