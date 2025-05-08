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
    if (!usuario || !usuario._id) {
      router.push('/login');
      return;
    }
    cargarCarrito(usuario._id);
  }, []);

  const cargarCarrito = async (userId) => {
    try {
      const data = await obtenerCarrito(userId);
      setCarrito(data);
    } catch (error) {
      console.error('Error cargando carrito:', error);
    }
  };

  const eliminarProducto = async (productoId, nombre) => {
    const usuario = JSON.parse(localStorage.getItem('user'));
    if (!usuario || !usuario._id) {
      alert('Debes iniciar sesión para eliminar productos.');
      return;
    }
    if (confirm(`¿Seguro que deseas eliminar "${nombre}" del carrito?`)) {
      try {
        await fetch(`http://localhost:5000/api/carrito/${usuario._id}/producto/${productoId}`, {
          method: 'DELETE',
        });
        cargarCarrito(usuario._id);
      } catch (error) {
        console.error('Error eliminando producto:', error);
      }
    }
  };

  const actualizarCantidad = async (productoId, nuevaCantidad) => {
    const usuario = JSON.parse(localStorage.getItem('user'));
    if (!usuario || !usuario._id) {
      alert('Debes iniciar sesión.');
      return;
    }
    try {
      await fetch(`http://localhost:5000/api/carrito/${usuario._id}/producto/${productoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cantidad: nuevaCantidad }),
      });
      cargarCarrito(usuario._id);
    } catch (error) {
      console.error('Error actualizando cantidad:', error);
    }
  };

  const vaciarTodoElCarrito = async () => {
    const usuario = JSON.parse(localStorage.getItem('user'));
    if (!usuario || !usuario._id) {
      alert('Debes iniciar sesión.');
      return;
    }
    try {
      await vaciarCarrito(usuario._id);
      cargarCarrito(usuario._id);
    } catch (error) {
      console.error('Error al vaciar el carrito:', error);
    }
  };

  const irAMetodoPago = () => {
    router.push('/metodo-pago');
  };

  const calcularTotal = () => {
    return carrito?.productos?.reduce((total, item) => total + item.precio * item.cantidad, 0) || 0;
  };

  return (
    <div className={styles.cartContainer}>
      <h1 className={styles.heading}>Tu Carrito</h1>
      {carrito && carrito.productos && carrito.productos.length > 0 ? (
        <>
          <div className={styles.cartGrid}>
            {carrito.productos.map((item, index) => (
              <div key={index} className={styles.cartItem}>
                <h2>{item.nombre}</h2>
                <p>{item.precio.toFixed(2)} Bs</p>
                <div>
                  <label>Cantidad: </label>
                  <input
                    type="number"
                    min="1"
                    value={item.cantidad}
                    onChange={(e) => actualizarCantidad(item.productoId, parseInt(e.target.value))}
                    style={{ width: '50px' }}
                  />
                </div>
                <button
                  className={styles.removeButton}
                  onClick={() => eliminarProducto(item.productoId, item.nombre)}
                >
                  Eliminar
                </button>
              </div>
            ))}
          </div>
          <h2 style={{ textAlign: 'center', marginTop: '20px' }}>
            Total: {calcularTotal().toFixed(2)} Bs
          </h2>
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <button onClick={irAMetodoPago} className={styles.completePurchaseButton}>
              Comprar
            </button>
            <button onClick={vaciarTodoElCarrito} style={{ marginLeft: '10px' }}>
              Vaciar Carrito
            </button>
          </div>
        </>
      ) : (
        <p>No tienes productos en el carrito.</p>
      )}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Link href="/catalog" passHref>
          <button>Volver al Catálogo</button>
        </Link>
      </div>
    </div>
  );
};

export default Cart;
