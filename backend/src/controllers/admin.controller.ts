import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as adminService from '../services/admin.service';
import { logger } from '../config/logger';

export const getStats = async (req: AuthRequest, res: Response) => {
  try {
    const stats = await adminService.getDashboardStats();
    res.json(stats);
  } catch (error: any) {
    logger.error('Get stats error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await adminService.getAllUsers();
    res.json(users);
  } catch (error: any) {
    logger.error('Get users error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const user = await adminService.updateUser(id, req.body);
    res.json(user);
  } catch (error: any) {
    logger.error('Update user error:', error);
    res.status(400).json({ error: error.message });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await adminService.deleteUser(id);
    res.json({ message: 'User deleted successfully' });
  } catch (error: any) {
    logger.error('Delete user error:', error);
    res.status(400).json({ error: error.message });
  }
};
