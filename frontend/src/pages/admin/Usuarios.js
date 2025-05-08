import { useState, useEffect } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import withAuth from '../../middlewares/withAuth';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/usuarios')
      .then(res => res.json())
      .then(data => setUsuarios(data))
      .catch(err => console.error('Error al obtener usuarios:', err));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <AdminNavbar /> {/* Navbar admin arriba */}
      <h1>Usuarios Registrados</h1>
      {usuarios.length > 0 ? (
        <ul>
          {usuarios.map(user => (
            <li key={user._id}>
              {user.nombre} - {user.email} - {user.rol}
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay usuarios registrados.</p>
      )}
    </div>
  );
};

export default withAuth(Usuarios, ['admin']);
