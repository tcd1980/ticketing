import express, { Request, Response } from 'express';
import { requireAuth } from '@ramsy-dev/microservices-shop-common';
import { Category } from '../models/category';

const router = express.Router();

router.get(
  '/api/categories',
  async (req: Request, res: Response) => {
    const categories = await Category.find({}).populate('products');

    res.send(categories);
  },
);

export { router as indexCategoryRouter };
