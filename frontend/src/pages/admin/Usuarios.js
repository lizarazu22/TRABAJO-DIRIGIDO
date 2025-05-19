import { useState, useEffect } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import withAuth from '../../middlewares/withAuth';
import styles from '../../styles/AdminUsuarios.module.css';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/usuarios')
      .then(res => res.json())
      .then(data => setUsuarios(data))
      .catch(err => console.error('Error al obtener usuarios:', err));
  }, []);

  return (
    <div className={styles.adminUsuariosContainer}>
      <AdminNavbar />
      <h1>📋 Usuarios Registrados</h1>
      {usuarios.length > 0 ? (
        <table className={styles.userTable}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Registrado</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(user => (
              <tr key={user._id}>
                <td>{user.nombre}</td>
                <td>{user.email}</td>
                <td>{user.rol}</td>
                <td>{new Date(user.creadoEn).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay usuarios registrados.</p>
      )}
    </div>
  );
};

export default withAuth(Usuarios, ['admin']);
