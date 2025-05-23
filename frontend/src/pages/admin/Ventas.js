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

  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      const res = await fetch(`http://localhost:5000/api/ventas/${id}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
      });
      const data = await res.json();
      if (res.ok) {
        cargarVentas();
        alert(data.message);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error cambiando estado:', error);
      alert('Error actualizando estado.');
    }
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
            <th>Comprobante</th>
            <th>Estado</th>
            <th>Acciones</th>
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
                <td>
                  {venta.comprobante ? (
                    <a href={venta.comprobante} target="_blank" rel="noopener noreferrer">Ver Comprobante</a>
                  ) : 'No adjunto'}
                </td>
                <td>
                  <strong style={{ color: venta.estado === 'confirmado' ? 'green' : venta.estado === 'rechazado' ? 'red' : 'orange' }}>
                    {venta.estado}
                  </strong>
                </td>
                <td>
                  {venta.estado === 'standby' ? (
                    <>
                      <button
                        className={styles.acceptButton}
                        onClick={() => {
                          if (confirm('¿Seguro que quieres aceptar este pedido?')) {
                            cambiarEstado(venta._id, 'confirmado');
                          }
                        }}
                      >
                        Aceptar
                      </button>
                      <button
                        className={styles.rejectButton}
                        style={{ marginLeft: '8px' }}
                        onClick={() => {
                          if (confirm('¿Seguro que quieres rechazar este pedido?')) {
                            cambiarEstado(venta._id, 'rechazado');
                          }
                        }}
                      >
                        Rechazar
                      </button>
                    </>
                  ) : (
                    <em>Sin acciones</em>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No hay ventas para mostrar.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Ventas;
