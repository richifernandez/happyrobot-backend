import { Request, Response, NextFunction } from 'express';

const API_KEY = process.env.API_KEY || 'test-secret';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || token !== API_KEY) {
    return res.status(403).json({ error: 'Invalid API key' });
  }

  next();
}