import { useState, useEffect } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import withAuth from '../../middlewares/withAuth';
import { fetchProducts } from '../../utils/api';
import styles from '../../styles/AdminCatalogo.module.css';

const CATEGORIAS = ['Categoría 1', 'Categoría 2', 'Categoría 3'];
const MATERIALES = ['Material 1', 'Material 2', 'Material 3'];
const COLORES = ['Color 1', 'Color 2', 'Color 3'];
const DENSIDADES = ['Densidad 1', 'Densidad 2', 'Densidad 3'];

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [productoEditando, setProductoEditando] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formulario, setFormulario] = useState({
    nombre: '',
    precio: '',
    stock: 0,
    categoria: '',
    material: '',
    color: '',
    densidad: '',
  });

  useEffect(() => {
    const cargarProductos = async () => {
      const data = await fetchProducts();
      setProductos(data);
    };
    cargarProductos();
  }, []);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario({ ...formulario, [name]: value });
  };

  const iniciarEdicion = (producto) => {
    setProductoEditando(producto._id);
    setFormulario({
      nombre: producto.nombre,
      precio: producto.precio,
      stock: producto.stock,
      categoria: producto.categoria,
      material: producto.material,
      color: producto.color,
      densidad: producto.densidad,
    });
  };

  const cancelarEdicion = () => {
    setProductoEditando(null);
    setFormulario({
      nombre: '',
      precio: '',
      stock: 0,
      categoria: '',
      material: '',
      color: '',
      densidad: '',
    });
  };

  const guardarCambios = () => {
    fetch(`http://localhost:5000/api/admin/productos/${productoEditando}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formulario),
    })
      .then((res) => res.json())
      .then(() => {
        setProductos(
          productos.map((p) =>
            p._id === productoEditando ? { ...p, ...formulario } : p
          )
        );
        cancelarEdicion();
      });
  };

  const eliminarProducto = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      fetch(`http://localhost:5000/api/admin/productos/${id}`, {
        method: 'DELETE',
      }).then(() =>
        setProductos(productos.filter((p) => p._id !== id))
      );
    }
  };

  const crearProducto = () => {
    if (
      !formulario.nombre ||
      formulario.precio === '' ||
      formulario.stock === '' ||
      !formulario.categoria ||
      !formulario.material ||
      !formulario.color ||
      !formulario.densidad
    ) {
      alert('Completa todos los campos');
      return;
    }

    fetch('http://localhost:5000/api/admin/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formulario),
    })
      .then((res) => res.json())
      .then((nuevo) => {
        setProductos([...productos, nuevo]);
        setFormulario({
          nombre: '',
          precio: '',
          stock: 0,
          categoria: '',
          material: '',
          color: '',
          densidad: '',
        });
        setMostrarFormulario(false);
      });
  };

  return (
    <div className={styles.adminCatalogoContainer}>
      <AdminNavbar />
      <h1>Gestión de Productos</h1>

      <button
        className={styles.toggleFormButton}
        onClick={() => setMostrarFormulario(!mostrarFormulario)}
      >
        {mostrarFormulario ? 'Cerrar formulario' : 'Agregar nuevo producto'}
      </button>

      {mostrarFormulario && (
        <div className={styles.productForm}>
          <input name="nombre" placeholder="Nombre" value={formulario.nombre} onChange={manejarCambio} />
          <input name="precio" type="number" placeholder="Precio" value={formulario.precio} min="0" step="1"
            onChange={manejarCambio} onKeyDown={(e) => ['-', '.', 'e'].includes(e.key) && e.preventDefault()} />
          <input name="stock" type="number" placeholder="Stock" value={formulario.stock} min="0" step="1"
            onChange={manejarCambio} onKeyDown={(e) => ['-', '.', 'e'].includes(e.key) && e.preventDefault()} />
          <select name="categoria" value={formulario.categoria} onChange={manejarCambio}>
            <option value="">Seleccione una categoría</option>
            {CATEGORIAS.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <select name="material" value={formulario.material} onChange={manejarCambio}>
            <option value="">Seleccione un material</option>
            {MATERIALES.map((mat) => <option key={mat} value={mat}>{mat}</option>)}
          </select>
          <select name="color" value={formulario.color} onChange={manejarCambio}>
            <option value="">Seleccione un color</option>
            {COLORES.map((col) => <option key={col} value={col}>{col}</option>)}
          </select>
          <select name="densidad" value={formulario.densidad} onChange={manejarCambio}>
            <option value="">Seleccione una densidad</option>
            {DENSIDADES.map((den) => <option key={den} value={den}>{den}</option>)}
          </select>
          <button onClick={crearProducto}>Crear Producto</button>
        </div>
      )}

      <div className={styles.productList}>
        {productos.map((prod) => (
          <div key={prod._id} className={styles.productItem}>
            {productoEditando === prod._id ? (
              <>
                <input name="nombre" value={formulario.nombre} onChange={manejarCambio} />
                <input name="precio" type="number" value={formulario.precio} min="0" step="1"
                  onChange={manejarCambio} onKeyDown={(e) => ['-', '.', 'e'].includes(e.key) && e.preventDefault()} />
                <input name="stock" type="number" value={formulario.stock} min="0" step="1"
                  onChange={manejarCambio} onKeyDown={(e) => ['-', '.', 'e'].includes(e.key) && e.preventDefault()} />
                <select name="categoria" value={formulario.categoria} onChange={manejarCambio}>
                  <option value="">Seleccione una categoría</option>
                  {CATEGORIAS.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <select name="material" value={formulario.material} onChange={manejarCambio}>
                  <option value="">Seleccione un material</option>
                  {MATERIALES.map((mat) => <option key={mat} value={mat}>{mat}</option>)}
                </select>
                <select name="color" value={formulario.color} onChange={manejarCambio}>
                  <option value="">Seleccione un color</option>
                  {COLORES.map((col) => <option key={col} value={col}>{col}</option>)}
                </select>
                <select name="densidad" value={formulario.densidad} onChange={manejarCambio}>
                  <option value="">Seleccione una densidad</option>
                  {DENSIDADES.map((den) => <option key={den} value={den}>{den}</option>)}
                </select>
                <div>
                  <button onClick={guardarCambios}>Guardar</button>
                  <button onClick={cancelarEdicion}>Cancelar</button>
                </div>
              </>
            ) : (
              <>
                <h3>{prod.nombre}</h3>
                <p>Precio: {prod.precio} Bs</p>
                <p>Stock: {prod.stock}</p>
                <p>Categoría: {prod.categoria}</p>
                <p>Material: {prod.material}</p>
                <p>Color: {prod.color}</p>
                <p>Densidad: {prod.densidad}</p>
                <button onClick={() => iniciarEdicion(prod)}>Editar</button>
                <button onClick={() => eliminarProducto(prod._id)}>Eliminar</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default withAuth(Productos, ['admin']);
