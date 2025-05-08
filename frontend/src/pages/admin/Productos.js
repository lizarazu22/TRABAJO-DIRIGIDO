import { useState, useEffect } from 'react';
import AdminNavbar from '../../components/AdminNavbar';
import withAuth from '../../middlewares/withAuth';
import { fetchProducts } from '../../utils/api';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [productoEditando, setProductoEditando] = useState(null);
  const [formulario, setFormulario] = useState({ nombre: '', precio: '', stock: 0 });

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
      stock: producto.stock
    });
  };

  const cancelarEdicion = () => {
    setProductoEditando(null);
    setFormulario({ nombre: '', precio: '', stock: 0 });
  };

  const guardarCambios = () => {
    fetch(`http://localhost:5000/api/admin/productos/${productoEditando}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formulario)
    })
      .then(res => res.json())
      .then(() => {
        setProductos(productos.map(p => (p._id === productoEditando ? { ...p, ...formulario } : p)));
        cancelarEdicion();
      });
  };

  const eliminarProducto = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      fetch(`http://localhost:5000/api/admin/productos/${id}`, { method: 'DELETE' })
        .then(() => setProductos(productos.filter(p => p._id !== id)));
    }
  };

  const crearProducto = () => {
    if (!formulario.nombre || formulario.precio === '' || formulario.stock === '') {
      alert('Completa todos los campos');
      return;
    }

    fetch('http://localhost:5000/api/admin/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formulario)
    })
      .then(res => res.json())
      .then(nuevo => {
        setProductos([...productos, nuevo]);
        setFormulario({ nombre: '', precio: '', stock: 0 });
      });
  };

  return (
    <div style={{ padding: '20px' }}>
      <AdminNavbar />
      <h1>Gestión de Productos</h1>

      <div style={{ margin: '30px 0' }}>
        <h2>Agregar nuevo producto</h2>
        <input
          name="nombre"
          placeholder="Nombre"
          value={formulario.nombre}
          onChange={manejarCambio}
        />
        <input
          name="precio"
          type="number"
          placeholder="Precio"
          value={formulario.precio}
          onChange={manejarCambio}
        />
        <input
          name="stock"
          type="number"
          placeholder="Stock"
          value={formulario.stock}
          onChange={manejarCambio}
        />
        <button style={{ marginLeft: '10px' }} onClick={crearProducto}>
          Crear Producto
        </button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {productos.map(prod => (
          <div
            key={prod._id}
            style={{
              border: '1px solid #ccc',
              padding: '15px',
              borderRadius: '8px',
              width: '250px'
            }}
          >
            {productoEditando === prod._id ? (
              <>
                <input
                  name="nombre"
                  value={formulario.nombre}
                  onChange={manejarCambio}
                />
                <input
                  name="precio"
                  type="number"
                  value={formulario.precio}
                  onChange={manejarCambio}
                />
                <input
                  name="stock"
                  type="number"
                  value={formulario.stock}
                  onChange={manejarCambio}
                />
                <div style={{ marginTop: '10px' }}>
                  <button onClick={guardarCambios}>Guardar</button>
                  <button onClick={cancelarEdicion} style={{ marginLeft: '5px' }}>
                    Cancelar
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3>{prod.nombre}</h3>
                <p>Precio: {prod.precio} Bs</p>
                <p>Stock: {prod.stock}</p>
                <button onClick={() => iniciarEdicion(prod)}>Editar</button>
                <button
                  style={{ backgroundColor: 'red', color: 'white', marginLeft: '5px' }}
                  onClick={() => eliminarProducto(prod._id)}
                >
                  Eliminar
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default withAuth(Productos, ['admin']);
