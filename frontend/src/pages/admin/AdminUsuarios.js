import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../../styles/AdminUsuarios.module.css';

const AdminUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/usuarios');
        setUsuarios(response.data);
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
      }
    };
    fetchUsuarios();
  }, []);

  const handleUsuarioClick = async (usuarioId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/ventas/por-usuario/${usuarioId}`);
      setVentas(response.data);
      const usuario = usuarios.find((u) => u._id === usuarioId);
      setUsuarioSeleccionado(usuario);
    } catch (error) {
      console.error('Error al obtener ventas del usuario:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Usuarios</h2>
      <ul className={styles.usuarioList}>
        {usuarios.map((usuario) => (
          <li key={usuario._id} onClick={() => handleUsuarioClick(usuario._id)}>
            {usuario.nombre} ({usuario.email})
          </li>
        ))}
      </ul>
      {usuarioSeleccionado && (
        <div className={styles.ventasContainer}>
          <h3>Ventas de {usuarioSeleccionado.nombre}</h3>
          <ul>
            {ventas.map((venta) => (
              <li key={venta._id}>
                Fecha: {new Date(venta.fecha).toLocaleDateString()} - Total: ${venta.total}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminUsuarios;
