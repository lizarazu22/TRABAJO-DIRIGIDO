import { useState, useEffect } from 'react';
import axios from 'axios';
import AdminNavbar from '../../components/AdminNavbar';
import styles from '../../styles/AdminDashboard.module.css';

const GastosAdmin = () => {
  const [gastos, setGastos] = useState([]);
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [nuevoGasto, setNuevoGasto] = useState({
    descripcion: '',
    monto: '',
    fecha: '',
  });

  const fetchGastos = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/gastos/por-fechas?desde=${desde}&hasta=${hasta}`);
      setGastos(res.data);
    } catch (err) {
      console.error('Error obteniendo gastos:', err);
    }
  };

  const handleAgregarGasto = async (e) => {
    e.preventDefault();
    if (!nuevoGasto.descripcion || !nuevoGasto.monto) {
      alert('Descripción y monto son obligatorios.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/gastos', nuevoGasto);
      setNuevoGasto({ descripcion: '', monto: '', fecha: '' });
      fetchGastos();
    } catch (err) {
      console.error('Error agregando gasto:', err);
    }
  };

  return (
    <div className={styles.adminContainer}>
      <AdminNavbar />
      <h1>📒 Administración de Gastos</h1>

      <div className={styles.filterGroup}>
        <label>Desde:</label>
        <input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
        <label>Hasta:</label>
        <input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} />
        <button onClick={fetchGastos}>Filtrar</button>
      </div>

      <h2>📑 Listado de Gastos</h2>
      <ul>
        {gastos.map((gasto) => (
          <li key={gasto._id}>
            {new Date(gasto.fecha).toLocaleDateString()} — <strong>{gasto.descripcion}</strong>: {gasto.monto.toFixed(2)} Bs
          </li>
        ))}
      </ul>

      <h2>➕ Agregar Nuevo Gasto</h2>
      <form onSubmit={handleAgregarGasto} className={styles.formGroup}>
        <input
          type="text"
          placeholder="Descripción"
          value={nuevoGasto.descripcion}
          onChange={(e) => setNuevoGasto({ ...nuevoGasto, descripcion: e.target.value })}
        />
        <input
          type="number"
          placeholder="Monto"
          value={nuevoGasto.monto}
          min="0"
          step="1"
          onChange={(e) => setNuevoGasto({ ...nuevoGasto, monto: e.target.value })}
          onKeyDown={(e) => ['-','.','e'].includes(e.key) && e.preventDefault()}
        />
        <input
          type="date"
          value={nuevoGasto.fecha}
          onChange={(e) => setNuevoGasto({ ...nuevoGasto, fecha: e.target.value })}
        />
        <button type="submit">Agregar Gasto</button>
      </form>
    </div>
  );
};

export default GastosAdmin;
