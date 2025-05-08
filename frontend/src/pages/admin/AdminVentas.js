import { useState } from 'react';
import axios from 'axios';
import styles from '../../styles/AdminVentas.module.css';

const AdminVentas = () => {
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [ventas, setVentas] = useState([]);

  const handleBuscar = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/ventas/por-fechas', {
        params: { desde, hasta },
      });
      setVentas(response.data);
    } catch (error) {
      console.error('Error al obtener ventas por fechas:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Ventas por Rango de Fechas</h2>
      <div className={styles.filtro}>
        <label>
          Desde:
          <input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
        </label>
        <label>
          Hasta:
          <input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} />
        </label>
        <button onClick={handleBuscar}>Buscar</button>
      </div>
      <ul className={styles.ventasList}>
        {ventas.map((venta) => (
          <li key={venta._id}>
            Fecha: {new Date(venta.fecha).toLocaleDateString()} - Total: ${venta.total}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminVentas;
