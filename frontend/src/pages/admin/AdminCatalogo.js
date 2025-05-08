import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../../styles/AdminCatalogo.module.css';

const AdminCatalogo = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/productos');
        setProductos(response.data);
      } catch (error) {
        console.error('Error al obtener productos:', error);
      }
    };
    fetchProductos();
  }, []);

  const handleEliminar = async (productoId) => {
    try {
      await axios.delete(`http://localhost:5000/api/productos/${productoId}`);
      setProductos(productos.filter((producto) => producto._id !== productoId));
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Gestión del Catálogo</h2>
      <ul className={styles.productoList}>
        {productos.map((producto) => (
          <li key={producto._id}>
            {producto.nombre} - ${producto.precio}
            <button onClick={() => handleEliminar(producto._id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminCatalogo;
