import express from 'express';
import { userRoutes } from './routes/user.routes.js';
import { taskRoutes } from './routes/task.routes.js';

export const app = express();
const PORT = 3000;

// --- MIDDLEWARES globais ---
app.use(express.json());

// --- ROUTES (Health Checks) ---
app.get('/ping', async (req, res) => {
  res.status(200).json({ status: 'success', message: 'API is running' });
});

// --- API ROUTES ---
app.use(userRoutes);
app.use(taskRoutes);

// --- SERVER INITIALIZATION ---
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  });
}