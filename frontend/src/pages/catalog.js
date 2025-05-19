import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Catalog.module.css';
import { agregarAlCarrito } from '../utils/carritoApi';
import { fetchProducts } from '../utils/api';

const Catalog = () => {
  const [productos, setProductos] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('user'));
    if (!usuario || !usuario._id) {
      router.push('/login');
      return;
    }
    setUser(usuario);
    obtenerProductos();
  }, []);

  const obtenerProductos = async () => {
    try {
      const data = await fetchProducts();
      setProductos(data);
    } catch (err) {
      console.error('Error al obtener catálogo:', err);
    }
  };

  const handleQuantityChange = (productoId, value) => {
    const num = parseInt(value);
    if (!num || num < 1) {
      setQuantities({ ...quantities, [productoId]: '' });
    } else {
      setQuantities({ ...quantities, [productoId]: num });
    }
  };

  const addToCart = async (product) => {
    const cantidad = quantities[product._id] || 1;

    if (cantidad > product.stock) {
      alert(`No hay suficiente stock disponible. Solo quedan ${product.stock} unidades.`);
      return;
    }

    const productoParaApi = {
      productoId: product._id,
      nombre: product.nombre,
      precio: product.precio,
      cantidad,
    };

    try {
      await agregarAlCarrito(user._id, productoParaApi);
      alert(`${product.nombre} agregado al carrito (${cantidad} unidades).`);
    } catch (err) {
      console.error('Error agregando producto:', err);
    }
  };

  return (
    <div className={styles.catalogContainer}>
      <h1 className={styles.heading}>Catálogo de Productos</h1>
      <div className={styles.productGrid}>
        {productos
          .filter(product => user?.rol === 'admin' || product.stock > 0)
          .map((product) => (
            <div key={product._id} className={styles.productCard}>
              <h2>{product.nombre}</h2>
              <p>Precio: {product.precio.toFixed(2)} Bs</p>
              <p>Stock: {product.stock}</p>
              <div>
                <label>Cantidad:</label>
                <input
                  type="number"
                  min="1"
                  value={quantities[product._id] || ''}
                  onChange={(e) => handleQuantityChange(product._id, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === '-' || e.key === '.' || e.key === 'e') e.preventDefault();
                  }}
                />
              </div>
              <button onClick={() => addToCart(product)}>
                Agregar al carrito
              </button>
            </div>
        ))}
      </div>
    </div>
  );
};

export default Catalog;
