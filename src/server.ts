import express, { type Request, type Response, type NextFunction } from 'express';
import { userRoutes } from './routes/user.routes.js';
import { taskRoutes } from './routes/task.routes.js';
import { setupSwagger } from './config/swagger.js';

export const app = express();

// Use the environment port if available, otherwise default to 3000
const PORT = process.env.PORT || 3000;

// --- Global Middlewares ---
app.use(express.json());

// --- API Documentation ---
setupSwagger(app);

// --- Health Check Route ---
app.get('/ping', (req: Request, res: Response) => {
  res.status(200).json({ status: 'success', message: 'API is running smoothly 🚀' });
});

// --- App Routes ---
app.use(userRoutes);
app.use(taskRoutes);

// --- Global Error Handler ---
// This catches any unhandled errors in the application so the server doesn't crash
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('🔥 Unhandled Error:', err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Internal Server Error'
  });
});

// --- Server Initialization ---
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📚 Documentation available at http://localhost:${PORT}/api-docs`);
  });
}