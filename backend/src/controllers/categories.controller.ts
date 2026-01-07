import { Request, Response } from 'express';
import * as categoriesService from '../services/categories.service';
import { logger } from '../config/logger';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await categoriesService.getCategories();
    res.json(categories);
  } catch (error: any) {
    logger.error('Get categories error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await categoriesService.getCategoryById(id);

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(category);
  } catch (error: any) {
    logger.error('Get category error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const category = await categoriesService.createCategory(req.body);
    res.status(201).json(category);
  } catch (error: any) {
    logger.error('Create category error:', error);
    res.status(400).json({ error: error.message });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await categoriesService.updateCategory(id, req.body);
    res.json(category);
  } catch (error: any) {
    logger.error('Update category error:', error);
    res.status(400).json({ error: error.message });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await categoriesService.deleteCategory(id);
    res.json({ message: 'Category deleted successfully' });
  } catch (error: any) {
    logger.error('Delete category error:', error);
    res.status(400).json({ error: error.message });
  }
};
