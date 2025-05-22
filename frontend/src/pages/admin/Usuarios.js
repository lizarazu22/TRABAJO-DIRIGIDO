import { useState, useEffect } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import withAuth from '../../middlewares/withAuth';
import styles from '../../styles/AdminUsuarios.module.css';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const obtenerUsuarios = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/usuarios');
      const data = await res.json();
      setUsuarios(data);
    } catch (err) {
      console.error('Error al obtener usuarios:', err);
    }
  };

  const abrirModalEditar = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setMostrarModalEditar(true);
  };

  const abrirModalEliminar = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setMostrarModalEliminar(true);
  };

  const cerrarModales = () => {
    setUsuarioSeleccionado(null);
    setMostrarModalEditar(false);
    setMostrarModalEliminar(false);
  };

  const handleEditarUsuario = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/usuarios/${usuarioSeleccionado._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuarioSeleccionado),
      });
      if (res.ok) {
        obtenerUsuarios();
        cerrarModales();
      }
    } catch (err) {
      console.error('Error al editar usuario:', err);
    }
  };

  const handleEliminarUsuario = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/usuarios/${usuarioSeleccionado._id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        obtenerUsuarios();
        cerrarModales();
      }
    } catch (err) {
      console.error('Error al eliminar usuario:', err);
    }
  };

  const handleCambioInput = (e) => {
    const { name, value } = e.target;
    setUsuarioSeleccionado({ ...usuarioSeleccionado, [name]: value });
  };

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
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((user) => (
              <tr key={user._id}>
                <td>{user.nombre}</td>
                <td>{user.email}</td>
                <td>{user.rol}</td>
                <td>{new Date(user.creadoEn).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => abrirModalEditar(user)}>Editar</button>
                  <button onClick={() => abrirModalEliminar(user)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay usuarios registrados.</p>
      )}

      {/* Modal de Edición */}
      {mostrarModalEditar && (
        <div className={styles.modal}>
          <div className={styles.modalContenido}>
            <h2>Editar Usuario</h2>
            <form onSubmit={handleEditarUsuario}>
              <label>
                Nombre:
                <input
                  type="text"
                  name="nombre"
                  value={usuarioSeleccionado.nombre}
                  onChange={handleCambioInput}
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={usuarioSeleccionado.email}
                  onChange={handleCambioInput}
                />
              </label>
              <label>
                Rol:
                <select
                  name="rol"
                  value={usuarioSeleccionado.rol}
                  onChange={handleCambioInput}
                >
                  <option value="admin">Admin</option>
                  <option value="cliente">Cliente</option>
                </select>
              </label>
              <div className={styles.modalAcciones}>
                <button type="submit">Guardar</button>
                <button type="button" onClick={cerrarModales}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Confirmación de Eliminación */}
      {mostrarModalEliminar && (
        <div className={styles.modal}>
          <div className={styles.modalContenido}>
            <h2>Confirmar Eliminación</h2>
            <p>
              ¿Estás seguro de que deseas eliminar al usuario{' '}
              <strong>{usuarioSeleccionado.nombre}</strong>?
            </p>
            <div className={styles.modalAcciones}>
              <button onClick={handleEliminarUsuario}>Eliminar</button>
              <button onClick={cerrarModales}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(Usuarios, ['admin']);
