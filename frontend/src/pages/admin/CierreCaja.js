import { useState, useEffect } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement,
} from 'chart.js';
import styles from '../../styles/cierreCaja.module.css';

Chart.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement
);

const CierreCaja = () => {
  const [desde, setDesde] = useState('');
  const [hasta, setHasta] = useState('');
  const [cierre, setCierre] = useState(null);
  const [graficoData, setGraficoData] = useState(null);
  const [comparativaMensualData, setComparativaMensualData] = useState(null);
  const [productosMasVendidosData, setProductosMasVendidosData] = useState(null);
  const [topComprador, setTopComprador] = useState(null);

  useEffect(() => {
    const hoy = new Date();
    const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const formatoFecha = (fecha) => fecha.toISOString().split('T')[0];
    setDesde(formatoFecha(primerDiaMes));
    setHasta(formatoFecha(hoy));
  }, []);

  const obtenerCierreCaja = async () => {
    if (!desde || !hasta) {
      alert('Seleccioná ambas fechas.');
      return;
    }

    try {
      const ventasRes = await fetch(`http://localhost:5000/api/ventas/por-fechas?desde=${desde}&hasta=${hasta}`);
      const ventasData = await ventasRes.json();

      const gastosRes = await fetch(`http://localhost:5000/api/gastos/por-fechas?desde=${desde}&hasta=${hasta}`);
      const gastosData = await gastosRes.json();

      const totalVentas = ventasData.reduce((sum, v) => sum + v.total, 0);
      const totalGastos = gastosData.reduce((sum, g) => sum + g.monto, 0);

      setCierre({
        totalVentas,
        totalGastos,
        utilidadNeta: totalVentas - totalGastos,
        ventas: ventasData,
        gastos: gastosData,
      });

      const ventasPorDia = {};
      ventasData.forEach((v) => {
        const fecha = new Date(v.fecha).toLocaleDateString();
        ventasPorDia[fecha] = (ventasPorDia[fecha] || 0) + v.total;
      });

      setGraficoData({
        labels: Object.keys(ventasPorDia),
        datasets: [
          {
            label: 'Ventas por Día (Bs)',
            data: Object.values(ventasPorDia),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
          },
        ],
      });

      const ventasPorMes = {};
      ventasData.forEach((v) => {
        const fecha = new Date(v.fecha);
        const mes = `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}`;
        ventasPorMes[mes] = (ventasPorMes[mes] || 0) + v.total;
      });

      const meses = Object.keys(ventasPorMes).sort();
      setComparativaMensualData({
        labels: meses,
        datasets: [
          {
            label: 'Ventas Mensuales (Bs)',
            data: meses.map((m) => ventasPorMes[m]),
            borderColor: 'rgba(153, 102, 255, 1)',
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            fill: false,
            tension: 0.1,
          },
        ],
      });

      const productosVendidos = {};
      ventasData.forEach((venta) => {
        venta.productos.forEach((p) => {
          productosVendidos[p.nombre] = (productosVendidos[p.nombre] || 0) + p.cantidad;
        });
      });

      const productos = Object.keys(productosVendidos);
      setProductosMasVendidosData({
        labels: productos,
        datasets: [
          {
            label: 'Productos Más Vendidos',
            data: productos.map((p) => productosVendidos[p]),
            backgroundColor: productos.map(
              () =>
                `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(
                  Math.random() * 255
                )}, 0.6)`
            ),
          },
        ],
      });

      // 👈 nuevo fetch al endpoint top-compradores
      const rankingRes = await fetch('http://localhost:5000/api/ventas/top-compradores');
      const rankingData = await rankingRes.json();
      setTopComprador(rankingData);

    } catch (err) {
      console.error('Error obteniendo datos:', err);
    }
  };

  return (
    <div className={styles.container}>
      <AdminNavbar />
      <h2 className={styles.heading}>💰 Cierre de Caja</h2>

      <div className={styles.filterGroup}>
        <label>Desde:</label>
        <input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
        <label>Hasta:</label>
        <input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} />
        <button onClick={obtenerCierreCaja}>Obtener Cierre</button>
      </div>

      {cierre && (
        <div className={styles.results}>
          <div className={styles.totalBox}>
            <h3>Total Ventas: {cierre.totalVentas.toFixed(2)} Bs</h3>
            <h3>Total Gastos: {cierre.totalGastos.toFixed(2)} Bs</h3>
            <h2 style={{ color: 'green' }}>Utilidad Neta: {cierre.utilidadNeta.toFixed(2)} Bs</h2>
          </div>

          <h3>📌 Ranking Top Compradores:</h3>
          {topComprador && topComprador.length > 0 ? (
            <ul>
              {topComprador.map((cliente, idx) => (
                <li key={idx}>
                  <strong>{cliente.email}</strong> — Gastó: {cliente.totalGastado.toFixed(2)} Bs en {cliente.cantidadCompras} compras
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay datos suficientes aún.</p>
          )}

          {graficoData && (
            <div className={styles.graphContainer}>
              <h3>📊 Ventas Diarias</h3>
              <Bar data={graficoData} />
            </div>
          )}

          {comparativaMensualData && (
            <div className={styles.graphContainer}>
              <h3>📈 Comparativa de Ventas Mensuales</h3>
              <Line data={comparativaMensualData} />
            </div>
          )}

          {productosMasVendidosData && (
            <div className={styles.graphContainer}>
              <h3>🥧 Productos Más Vendidos</h3>
              <Pie data={productosMasVendidosData} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CierreCaja;
