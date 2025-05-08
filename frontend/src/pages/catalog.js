import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Catalog.module.css';
import { agregarAlCarrito } from '../utils/carritoApi';
import { fetchProducts } from '../utils/api';

const Catalog = () => {
  const [productos, setProductos] = useState([]);
  const [quantities, setQuantities] = useState({});
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user._id) {
      router.push('/login');
      return;
    }

    const obtenerProductos = async () => {
      try {
        const data = await fetchProducts();
        setProductos(data);
      } catch (err) {
        console.error('Error al obtener catálogo:', err);
      }
    };

    obtenerProductos();
  }, []);

  const handleQuantityChange = (productoId, value) => {
    setQuantities({ ...quantities, [productoId]: parseInt(value) || 1 });
  };

  const addToCart = async (product) => {
    const usuario = JSON.parse(localStorage.getItem('user'));
    if (!usuario || !usuario._id) {
      alert('Debes iniciar sesión para agregar productos.');
      return;
    }

    const cantidad = quantities[product._id] || 1;
    const productoParaApi = {
      productoId: product._id,
      nombre: product.nombre,
      precio: product.precio,
      cantidad,
    };

    try {
      const res = await agregarAlCarrito(usuario._id, productoParaApi);
      alert(`${product.nombre} agregado al carrito (${cantidad} unidades).`);
    } catch (err) {
      console.error('Error agregando producto:', err);
    }
  };

  return (
    <div className={styles.catalogContainer}>
      <h1 className={styles.heading}>Catálogo de Productos</h1>
      <div className={styles.productGrid}>
        {productos.map((product) => (
          <div key={product._id} className={styles.productCard}>
            <h2>{product.nombre}</h2>
            <p>Precio: {product.precio.toFixed(2)} Bs</p>
            <p>Stock: {product.stock}</p>
            <div>
              <label>Cantidad:</label>
              <input
                type="number"
                min="1"
                value={quantities[product._id] || 1}
                onChange={(e) => handleQuantityChange(product._id, e.target.value)}
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
