import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import { Product } from '../types/global';
import { useCart } from '../hooks/useCart';
import * as productsApi from '../api/productsApi';
import styles from './ProductDetails.module.css';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const data = await productsApi.getProductById(id);
        setProduct(data);
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    const variant = product.variants?.find((v) => v.id === selectedVariant);
    addItem(product, variant, quantity);
    navigate('/cart');
  };

  if (loading) {
    return <Loader />;
  }

  if (!product) {
    return <div className={styles.error}>Product not found</div>;
  }

  const price = selectedVariant
    ? product.variants?.find((v) => v.id === selectedVariant)?.price || product.price
    : product.price;

  return (
    <div className={styles.details}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.imageSection}>
            {product.images && product.images.length > 0 ? (
              <img src={product.images[0]} alt={product.name} className={styles.image} />
            ) : (
              <div className={styles.placeholder}>No Image</div>
            )}
          </div>
          
          <div className={styles.infoSection}>
            <h1 className={styles.name}>{product.name}</h1>
            {product.category && (
              <p className={styles.category}>{product.category.name}</p>
            )}
            <p className={styles.price}>${price.toFixed(2)}</p>
            <p className={styles.description}>{product.description}</p>
            
            {product.variants && product.variants.length > 0 && (
              <div className={styles.variants}>
                <label className={styles.label}>Select {product.variants[0].name}:</label>
                <div className={styles.variantOptions}>
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant.id)}
                      className={`${styles.variantBtn} ${
                        selectedVariant === variant.id ? styles.active : ''
                      }`}
                    >
                      {variant.value}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className={styles.quantity}>
              <label className={styles.label}>Quantity:</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
                className={styles.quantityInput}
              />
            </div>
            
            <button onClick={handleAddToCart} className={styles.addToCart}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
