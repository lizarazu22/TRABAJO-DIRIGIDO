import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/Cart.module.css';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
  }, []);

  const updateQuantity = (productId, quantity) => {
    const updatedCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity: parseInt(quantity) || 1 } : item
    );
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleCompletePurchase = () => {
    router.push('/payment-options'); // Redirige a la página de opciones de pago
  };

  return (
    <div className={styles.cartContainer}>
      <h1 className={styles.heading}>Tu Carrito</h1>
      {cart.length === 0 ? (
        <p>No tienes productos en el carrito.</p>
      ) : (
        <div className={styles.cartGrid}>
          {cart.map((item) => (
            <div key={item.id} className={styles.cartItem}>
              <h2>{item.name}</h2>
              <p>{item.price.toFixed(2)} €</p>
              <div>
                <label htmlFor={`quantity-${item.id}`}>Cantidad: </label>
                <input
                  type="number"
                  id={`quantity-${item.id}`}
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateQuantity(item.id, e.target.value)}
                  style={{ width: '50px' }}
                />
              </div>
              <p>Total: {(item.price * item.quantity).toFixed(2)} €</p>
              <button
                className={styles.removeButton}
                onClick={() => removeFromCart(item.id)}
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Link href="/catalog" passHref>
          <button>Volver al Catálogo</button>
        </Link>
        {cart.length > 0 && (
          <button
            className={styles.completePurchaseButton}
            onClick={handleCompletePurchase}
            style={{ marginLeft: '10px' }}
          >
            Completar Compra-
          </button>
        )}
      </div>
    </div>
  );
};

export default Cart;
