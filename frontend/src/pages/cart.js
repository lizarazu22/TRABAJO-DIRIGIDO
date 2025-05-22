import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/Cart.module.css';
import { obtenerCarrito, vaciarCarrito } from '../utils/carritoApi';

const Cart = () => {
  const [carrito, setCarrito] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('user'));
    if (!usuario) router.push('/login');
    else cargarCarrito(usuario._id);
  }, []);

  const cargarCarrito = async (userId) => {
    const data = await obtenerCarrito(userId);
    setCarrito(data);
  };

  const eliminarProducto = async (productoId) => {
    const usuario = JSON.parse(localStorage.getItem('user'));
    await fetch(`http://localhost:5000/api/carrito/${usuario._id}/producto/${productoId}`, { method: 'DELETE' });
    cargarCarrito(usuario._id);
  };

  const actualizarCantidad = async (productoId, nuevaCantidad) => {
    if (nuevaCantidad < 1 || isNaN(nuevaCantidad)) return;
    const usuario = JSON.parse(localStorage.getItem('user'));
    await fetch(`http://localhost:5000/api/carrito/${usuario._id}/producto/${productoId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cantidad: nuevaCantidad }),
    });
    cargarCarrito(usuario._id);
  };

  const vaciarTodoElCarrito = async () => {
    const usuario = JSON.parse(localStorage.getItem('user'));
    await vaciarCarrito(usuario._id);
    cargarCarrito(usuario._id);
  };

  const calcularTotal = () => carrito?.productos?.reduce((t, p) => t + p.precio * p.cantidad, 0) || 0;

  return (
    <div className={styles.cartContainer}>
      <h1 className={styles.heading}>🛒 Tu Carrito</h1>
      {carrito?.productos?.length > 0 ? (
        <>
          <div className={styles.cartGrid}>
            {carrito.productos.map((item, i) => (
              <div key={i} className={styles.cartItem}>
                <h2>{item.nombre}</h2>
                <p>{item.precio.toFixed(2)} Bs</p>
                <p><strong>Stock disponible:</strong> {item.stock}</p>
                <div>
                  <label>Cantidad:</label>
                  <input
                    type="number"
                    min="1"
                    max={item.stock}
                    value={item.cantidad}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (val > item.stock) {
                        alert(`Stock máximo disponible: ${item.stock}`);
                        return;
                      }
                      actualizarCantidad(item.productoId, val);
                    }}
                    onKeyDown={(e) => ['-','.','e'].includes(e.key) && e.preventDefault()}
                    style={{ width: '60px' }}
                  />
                </div>
                <button className={styles.removeButton} onClick={() => eliminarProducto(item.productoId)}>
                  Eliminar
                </button>
              </div>
            ))}
          </div>

          <h2 style={{ textAlign: 'center', marginTop: '20px' }}>Total: {calcularTotal().toFixed(2)} Bs</h2>

          <div className={styles.actionButtons}>
            <button onClick={() => router.push('/metodo-pago')} className={styles.completePurchaseButton}>
              Finalizar Compra
            </button>
            <button onClick={vaciarTodoElCarrito}>Vaciar Carrito</button>
            <button onClick={() => router.push('/mis-compras')}>Ver Mis Compras</button>
            <button onClick={() => router.push('/catalog')}>Volver al Catálogo</button>
          </div>
        </>
      ) : (
        <p style={{ textAlign: 'center' }}>No tienes productos en el carrito.</p>
      )}
    </div>
  );
};

export default Cart;
