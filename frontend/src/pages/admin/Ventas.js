import { useState } from 'react';
import AdminNavbar from '../../components/AdminNavbar';

const Ventas = () => {
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [ventas, setVentas] = useState([]);

  const obtenerVentas = () => {
    fetch(`/api/ventas?desde=${desde}&hasta=${hasta}`)
      .then(res => res.json())
      .then(data => setVentas(data))
      .catch(err => console.error(err));
  };

  return (
    <div>
      <AdminNavbar />
      <h2>Reporte de Ventas</h2>
      <label>Desde: <input type="date" value={desde} onChange={e => setDesde(e.target.value)} /></label>
      <label>Hasta: <input type="date" value={hasta} onChange={e => setHasta(e.target.value)} /></label>
      <button onClick={obtenerVentas}>Obtener Ventas</button>
      <ul>
        {ventas.map(venta => (
          <li key={venta._id}>
            Fecha: {new Date(venta.fecha).toLocaleDateString()} - Total: {venta.total}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Ventas;
