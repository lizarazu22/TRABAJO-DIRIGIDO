import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { obtenerCarrito, vaciarCarrito } from '../utils/carritoApi';
import styles from '../styles/PaymentOptions.module.css';

const MetodoPago = () => {
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

  const completarCompra = async () => {
    const usuario = JSON.parse(localStorage.getItem('user'));
    if (!usuario || !usuario._id || !carrito || !carrito.productos.length) {
      alert('Debes iniciar sesión y tener productos en el carrito.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/ventas', { // ✅ RUTA CORRECTA
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuarioId: usuario._id,
          productos: carrito.productos
        })
      });
      const data = await res.json();
      if (res.ok) {
        alert('Compra completada correctamente.');
        await vaciarCarrito(usuario._id);
        router.push('/mis-compras');
      } else {
        alert(data.message || 'Error al completar compra');
      }
    } catch (error) {
      console.error('Error completando compra:', error);
      alert('Hubo un problema al completar la compra.');
    }
  };

  return (
    <div className={styles.paymentContainer}>
      <h1>Opciones de Pago</h1>
      <p>Selecciona el método de pago que prefieras:</p>

      <div className={styles.paymentMethods}>
        <div className={styles.paymentOption}>
          <h2>Pago con QR</h2>
          <p>Escanea este código QR con tu aplicación de pagos:</p>
          <img src="/images/qr-code.png" alt="Código QR de pago" />
        </div>

        <div className={styles.paymentOption}>
          <h2>Depósito Bancario</h2>
          <p>
            Realiza un depósito a la siguiente cuenta bancaria:
          </p>
          <ul>
            <li>Banco: Banco Ejemplo</li>
            <li>Cuenta: 1234567890</li>
            <li>Nombre: Ignacio Lizarazu</li>
          </ul>
        </div>
      </div>

      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <button onClick={completarCompra} className={styles.completePurchaseButton}>
          Completar Compra
        </button>
      </div>
    </div>
  );
};

export default MetodoPago;
