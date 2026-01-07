import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProductCard from '../src/components/ProductCard';
import { Product } from '../src/types/global';

const mockProduct: Product = {
  id: '1',
  name: 'Test Product',
  slug: 'test-product',
  description: 'Test description',
  price: 29.99,
  stock: 100,
  featured: false,
  images: [],
  categoryId: '1',
};

describe('ProductCard', () => {
  it('renders product name', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('renders product price', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('$29.99')).toBeInTheDocument();
  });
});
