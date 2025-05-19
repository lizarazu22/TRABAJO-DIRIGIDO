import { useState, useEffect } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import styles from '../../styles/AdminVentas.module.css';

const Ventas = () => {
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [ventas, setVentas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState('');

  useEffect(() => {
    cargarVentas();
    cargarUsuarios();
  }, []);

  const cargarVentas = () => {
    fetch('http://localhost:5000/api/ventas')
      .then(res => res.json())
      .then(data => setVentas(data))
      .catch(err => console.error('Error cargando ventas:', err));
  };

  const cargarUsuarios = () => {
    fetch('http://localhost:5000/api/usuarios')
      .then(res => res.json())
      .then(data => setUsuarios(data))
      .catch(err => console.error('Error cargando usuarios:', err));
  };

  const buscarVentas = () => {
    const params = new URLSearchParams();
    if (usuarioSeleccionado) params.append('usuarioId', usuarioSeleccionado);
    if (desde && hasta) {
      params.append('desde', desde);
      params.append('hasta', hasta);
    }

    fetch(`http://localhost:5000/api/ventas/filtrar?${params.toString()}`)
      .then(res => res.json())
      .then(data => setVentas(data))
      .catch(err => console.error('Error filtrando ventas:', err));
  };

  return (
    <div className={styles.adminVentasContainer}>
      <AdminNavbar />
      <h2>📊 Reporte de Ventas</h2>

      <div className={styles.filters}>
        <label>
          Desde:
          <input type="date" value={desde} onChange={e => setDesde(e.target.value)} />
        </label>
        <label>
          Hasta:
          <input type="date" value={hasta} onChange={e => setHasta(e.target.value)} />
        </label>
        <label>
          Usuario:
          <select value={usuarioSeleccionado} onChange={e => setUsuarioSeleccionado(e.target.value)}>
            <option value="">-- Todos --</option>
            {usuarios.map(u => (
              <option key={u._id} value={u._id}>{u.nombre} ({u.email})</option>
            ))}
          </select>
        </label>
        <button onClick={buscarVentas}>Filtrar</button>
      </div>

      <table className={styles.salesTable}>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Total (Bs)</th>
            <th>Productos</th>
          </tr>
        </thead>
        <tbody>
          {ventas.length > 0 ? (
            ventas.map(venta => (
              <tr key={venta._id}>
                <td>{new Date(venta.fecha).toLocaleString()}</td>
                <td>{venta.total.toFixed(2)}</td>
                <td>
                  <ul>
                    {venta.productos.map((p, i) => (
                      <li key={i}>{p.nombre} - {p.cantidad} u. - {p.precio} Bs c/u</li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No hay ventas para mostrar.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Ventas;
