import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/MisCompras.module.css';

const MisCompras = () => {
  const [compras, setCompras] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('user'));
    if (!usuario || !usuario._id) {
      router.push('/login');
      return;
    }
    fetch(`http://localhost:5000/api/ventas/por-usuario/${usuario._id}`)
      .then(res => res.json())
      .then(data => setCompras(data))
      .catch(err => console.error('Error cargando compras:', err));
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>🛍️ Mis Compras</h1>

      {compras.length === 0 ? (
        <p className={styles.emptyMessage}>No realizaste compras todavía.</p>
      ) : (
        compras.map((venta, idx) => (
          <div key={idx} className={styles.compraCard}>
            <h3>Compra realizada el <strong>{new Date(venta.fecha).toLocaleString()}</strong></h3>
            <ul className={styles.productList}>
              {venta.productos.map((p, i) => (
                <li key={i}>
                  {p.nombre} — {p.cantidad} u. — {p.precio.toFixed(2)} Bs c/u
                </li>
              ))}
            </ul>
            <div className={styles.total}>
              Total: <strong>{venta.total.toFixed(2)} Bs</strong>
            </div>
            <div className={`${styles.estado} ${styles[venta.estado]}`}>
              Estado: {venta.estado.toUpperCase()}
            </div>
          </div>
        ))
      )}

      <div className={styles.actionButtons}>
        <button onClick={() => router.push('/cart')}>Volver al Carrito</button>
        <button onClick={() => router.push('/catalog')}>Ir al Catálogo</button>
      </div>
    </div>
  );
};

export default MisCompras;
