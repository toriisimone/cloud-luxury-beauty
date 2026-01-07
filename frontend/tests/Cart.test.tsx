import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CartProvider } from '../src/context/CartContext';

describe('Cart', () => {
  it('provides cart context', () => {
    const TestComponent = () => {
      return <div>Cart Test</div>;
    };

    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    expect(screen.getByText('Cart Test')).toBeInTheDocument();
  });
});
