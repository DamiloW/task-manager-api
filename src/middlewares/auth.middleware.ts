import type { Request, Response, NextFunction } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';

// Extends the default Express Request to include the userId
export interface AuthRequest extends Request {
    userId?: string;
}

// Defines the expected structure of our JWT payload
interface TokenPayload extends JwtPayload {
    userId: string;
}

/**
 * Middleware to protect routes by validating the JWT token.
 * Extracts the token from the Authorization header, verifies its validity,
 * and injects the userId into the request object.
 */
export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ status: 'error', message: 'Access denied. Token not provided.' });
    }

    // Expected format: "Bearer <token>"
    const [, token] = authHeader.split(' ');
    
    if (!token) {
        return res.status(401).json({ status: 'error', message: 'Access denied. Malformed token.' });
    }

    try {
        // Fallback secret is used for local development/portfolio. 
        // In strict production, an undefined JWT_SECRET should crash the app for safety.
        const secret = process.env.JWT_SECRET || 'my_super_secret_key_123';
        
        const decoded = jwt.verify(token, secret) as TokenPayload;
        
        // Inject the authenticated user ID into the request object
        req.userId = decoded.userId;
        
        return next();

    } catch (error) {
        return res.status(401).json({ status: 'error', message: 'Access denied. Invalid or expired token.' });
    }
};