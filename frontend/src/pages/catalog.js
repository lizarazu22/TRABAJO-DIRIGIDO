import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Catalog.module.css';
import { agregarAlCarrito } from '../utils/carritoApi';
import { fetchProducts } from '../utils/api';
import SidebarFilters from '../components/SidebarFilters';
import AISidebar from '../components/AISidebar';

const Catalog = () => {
  const [productosOriginales, setProductosOriginales] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [flipped, setFlipped] = useState({});
  const [filters, setFilters] = useState({
    category: '',
    price: '',
    inStock: false,
  });
  const [user, setUser] = useState(null);
  const [categorias, setCategorias] = useState([]);
  const [materiales, setMateriales] = useState([]);
  const [colores, setColores] = useState([]);
  const [densidades, setDensidades] = useState([]);
  const [iaSidebarOpen, setIaSidebarOpen] = useState(false);
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
      setProductosOriginales(data);
      setFilteredProducts(data);
      setCategorias([...new Set(data.map(p => p.categoria))]);
      setMateriales([...new Set(data.map(p => p.material))]);
      setColores([...new Set(data.map(p => p.color))]);
      setDensidades([...new Set(data.map(p => p.densidad))]);
    } catch (err) {
      console.error('Error al obtener catálogo:', err);
    }
  };

  const aplicarFiltros = () => {
    let filtrados = [...productosOriginales];
    if (filters.category)
      filtrados = filtrados.filter((p) => p.categoria === filters.category);
    if (filters.material)
      filtrados = filtrados.filter((p) => p.material === filters.material);
    if (filters.color)
      filtrados = filtrados.filter((p) => p.color === filters.color);
    if (filters.densidad)
      filtrados = filtrados.filter((p) => p.densidad === filters.densidad);
    if (filters.price)
      filtrados = filtrados.filter((p) => p.precio <= Number(filters.price));
    if (filters.inStock)
      filtrados = filtrados.filter((p) => p.stock > 0);
    if (filters.enOferta)
      filtrados = filtrados.filter((p) => p.oferta === true);
    if (filters.nuevos)
      filtrados = filtrados.filter((p) => {
        const creadoHace = (Date.now() - new Date(p.creadoEn).getTime()) / (1000 * 60 * 60 * 24);
        return creadoHace <= 30;
      });
    if (filters.ordenarPor) {
      switch (filters.ordenarPor) {
        case 'precioAsc':
          filtrados.sort((a, b) => a.precio - b.precio);
          break;
        case 'precioDesc':
          filtrados.sort((a, b) => b.precio - a.precio);
          break;
        case 'nombreAsc':
          filtrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
          break;
        case 'nombreDesc':
          filtrados.sort((a, b) => b.nombre.localeCompare(a.nombre));
          break;
      }
    }
    setFilteredProducts(filtrados);
  };

  const resetearCatalogo = () => {
    setFilteredProducts(productosOriginales);
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

  const toggleFlip = (id) => {
    setFlipped({ ...flipped, [id]: !flipped[id] });
  };

  const filtrarPorIA = (recomendados) => {
    resetearCatalogo(); // Resetea antes de filtrar IA
    const nombres = recomendados.map((p) => p.nombre);
    const filtrados = productosOriginales.filter((p) => nombres.includes(p.nombre));
    setFilteredProducts(filtrados);
  };

  useEffect(() => {
    aplicarFiltros();
  }, [filters]);

  return (
    <div className={styles.catalogContainer}>
      <SidebarFilters
        filters={filters}
        setFilters={setFilters}
        categorias={categorias}
        materiales={materiales}
        colores={colores}
        densidades={densidades}
      />

      <button
        onClick={() => setIaSidebarOpen(!iaSidebarOpen)}
        className={`${styles.iaToggleButton} ${iaSidebarOpen ? styles.active : ''}`}
      >
        {iaSidebarOpen ? 'Cerrar IA' : '🤖 IA'}
      </button>

      <h1 className={styles.heading}>Catálogo de Productos</h1>

      <div className={styles.productGrid}>
        {filteredProducts
          .filter((product) => user?.rol === 'admin' || product.stock > 0)
          .map((product) => (
            <div
              key={product._id}
              className={`${styles.productCard} ${flipped[product._id] ? styles.flipped : ''}`}
              onClick={() => toggleFlip(product._id)}
            >
              <div className={styles.cardInner}>
                <div className={styles.cardFront}>
                  <h2>{product.nombre}</h2>
                  <p>Precio: {product.precio.toFixed(2)} Bs</p>
                  <p>Stock: {product.stock}</p>
                  <p><strong>Categoría:</strong> {product.categoria}</p>
                  <p><strong>Material:</strong> {product.material}</p>
                  <p><strong>Color:</strong> {product.color}</p>
                  <p><strong>Densidad:</strong> {product.densidad}</p>
                  <div>
                    <label>Cantidad:</label>
                    <input
                      type="number"
                      min="1"
                      value={quantities[product._id] || ''}
                      onChange={(e) => handleQuantityChange(product._id, e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => {
                        if (e.key === '-' || e.key === '.' || e.key === 'e') e.preventDefault();
                      }}
                    />
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                  >
                    Agregar al carrito
                  </button>
                </div>
                <div className={styles.cardBack}>
                  <h3>Descripción</h3>
                  <p>{product.descripcion || 'Sin descripción disponible.'}</p>
                  <small>(Click para volver)</small>
                </div>
              </div>
            </div>
          ))}
      </div>

      <AISidebar
        isOpen={iaSidebarOpen}
        onClose={() => setIaSidebarOpen(false)}
        onFiltrarIA={filtrarPorIA}
      />
    </div>
  );
};

export default Catalog;
