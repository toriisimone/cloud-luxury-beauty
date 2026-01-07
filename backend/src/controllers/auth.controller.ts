import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { logger } from '../config/logger';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const result = await authService.register({
      email,
      password,
      firstName,
      lastName,
    });

    res.status(201).json(result);
  } catch (error: any) {
    logger.error('Registration error:', error);
    res.status(400).json({ error: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    res.json(result);
  } catch (error: any) {
    logger.error('Login error:', error);
    res.status(401).json({ error: error.message });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshToken(refreshToken);

    res.json(result);
  } catch (error: any) {
    logger.error('Refresh token error:', error);
    res.status(401).json({ error: error.message });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.json({ message: 'Logged out successfully' });
};
