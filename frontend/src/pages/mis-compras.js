import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

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
    <div style={{ padding: '20px' }}>
      <h1>Mis Compras</h1>

      {compras.length === 0 ? (
        <p>No realizaste compras todavía.</p>
      ) : (
        compras.map((venta, idx) => (
          <div key={idx} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
            <h3>Compra realizada el {new Date(venta.fecha).toLocaleString()}</h3>
            <ul>
              {venta.productos.map((p, i) => (
                <li key={i}>
                  {p.nombre} - {p.cantidad} unidades - {p.precio} Bs c/u
                </li>
              ))}
            </ul>
            <strong>Total: {venta.total} Bs</strong>
          </div>
        ))
      )}

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button onClick={() => router.push('/cart')}>Volver al carrito</button>
      </div>
    </div>
  );
};

export default MisCompras;
