import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    userId?: string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ status: 'error', message: 'Acesso Negado. Token não fornecido!'});
    }

    const [, token] = authHeader.split(' ');
    
    if (!token) {
        return res.status(401).json({ status: 'error', message: 'Acesso negado. Token mal formatado!' });
    }

    try {
        const secret = process.env.JWT_SECRET || 'my_super_secret_key_123';
        const decoded = jwt.verify(token, secret) as unknown as { userId: string };
        req.userId = decoded.userId
        return next();

    } catch (error) {
        return res.status(401).json({ status: 'error', message: 'Acesso negado. Token inválido ou expirado!' })
    }
};