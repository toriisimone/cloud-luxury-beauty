import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/verifyToken';
import { logger } from '../config/logger';

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    req.userId = decoded.userId;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.userRole !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};
