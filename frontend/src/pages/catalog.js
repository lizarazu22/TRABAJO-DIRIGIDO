import { useState } from 'react';
import Link from 'next/link';
import styles from '../styles/Catalog.module.css';

const Catalog = () => {
  const [quantities, setQuantities] = useState({});
  
  const products = [
    { id: 1, name: 'Hummingbird Printed T-Shirt', price: 19.12, oldPrice: 30.04, discount: 20, image: '/images/tshirt1.jpg' },
    { id: 2, name: 'Hummingbird Printed Sweater', price: 28.72, oldPrice: 36.90, discount: 20, image: '/images/sweater.jpg' },
    { id: 3, name: 'The Best Is Yet To Come Poster', price: 20.00, image: '/images/poster1.jpg' },
    { id: 4, name: 'The Adventure Begins Poster', price: 20.00, image: '/images/poster2.jpg' },
    { id: 5, name: 'Today Is A Good Day Poster', price: 29.00, image: '/images/poster3.jpg' },
    { id: 6, name: 'Mug The Best Is Yet To Come', price: 11.90, image: '/images/mug1.jpg' },
    { id: 7, name: 'Mug The Adventure Begins', price: 11.90, image: '/images/mug2.jpg' },
    { id: 8, name: 'Mug Today Is A Good Day', price: 11.90, image: '/images/mug3.jpg' },
  ];
  const handleQuantityChange = (productId, value) => {
    setQuantities({ ...quantities, [productId]: parseInt(value) || 1 });
  };

  const addToCart = (product) => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const quantity = quantities[product.id] || 1;

    const existingProductIndex = savedCart.findIndex((item) => item.id === product.id);
    if (existingProductIndex !== -1) {
      savedCart[existingProductIndex].quantity += quantity;
    } else {
      savedCart.push({ ...product, quantity });
    }

    localStorage.setItem('cart', JSON.stringify(savedCart));
    alert(`${product.name} agregado al carrito (${quantity} unidades).`);
  };

  return (
    <div className={styles.catalogContainer}>
      <h1 className={styles.heading}>Productos Destacados</h1>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <Link href="/cart" passHref>
          <button style={{ marginRight: '10px' }}>Ir al Carrito</button>
        </Link>
        <Link href="/" passHref>
          <button>Volver al Inicio</button>
        </Link>
      </div>
      <div className={styles.productGrid}>
        {products.map((product) => (
          <div key={product.id} className={styles.productCard}>
            <img src={product.image} alt={product.name} className={styles.productImage} />
            <h2>{product.name}</h2>
            <p className={styles.price}>{product.price.toFixed(2)} €</p>
            <div>
              <label htmlFor={`quantity-${product.id}`}>Cantidad: </label>
              <input
                type="number"
                id={`quantity-${product.id}`}
                min="1"
                value={quantities[product.id] || 1}
                onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                style={{ width: '50px' }}
              />
            </div>
            <button
              className={styles.addToCartButton}
              onClick={() => addToCart(product)}
            >
              Agregar al carrito
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Catalog;
