import { Request, Response } from 'express';
import * as productsService from '../services/products.service';
import { logger } from '../config/logger';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const {
      categoryId,
      search,
      minPrice,
      maxPrice,
      featured,
      page = '1',
      limit = '20',
    } = req.query;

    const result = await productsService.getProducts({
      categoryId: categoryId as string,
      search: search as string,
      minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
      featured: featured === 'true' ? true : featured === 'false' ? false : undefined,
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
    });

    res.json(result);
  } catch (error: any) {
    logger.error('Get products error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await productsService.getProductById(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error: any) {
    logger.error('Get product error:', error);
    res.status(500).json({ error: error.message });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await productsService.createProduct(req.body);
    res.status(201).json(product);
  } catch (error: any) {
    logger.error('Create product error:', error);
    res.status(400).json({ error: error.message });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await productsService.updateProduct(id, req.body);
    res.json(product);
  } catch (error: any) {
    logger.error('Update product error:', error);
    res.status(400).json({ error: error.message });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await productsService.deleteProduct(id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    logger.error('Delete product error:', error);
    res.status(400).json({ error: error.message });
  }
};
