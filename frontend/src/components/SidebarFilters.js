import { useState } from 'react';
import styles from '../styles/SidebarFilters.module.css';

const SidebarFilters = ({ filters, setFilters }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <>
      <button className={styles.toggleButton} onClick={toggleSidebar}>
        {isOpen ? 'Cerrar Filtros' : 'Abrir Filtros'}
      </button>
      <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        <div className={styles.filterGroup}>
        <h2>-      </h2>
          <label htmlFor="category">Categoría</label>
          <select name="category" id="category" onChange={handleChange}>
            <option value="">Todas</option>
            <option value="hilos">Hilos</option>
            <option value="telas">Telas</option>
            <option value="accesorios">Accesorios</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="material">Material</label>
          <select name="material" id="material" onChange={handleChange}>
            <option value="">Todos</option>
            <option value="Alpaca">Alpaca</option>
            <option value="Llama">Llama</option>
            <option value="Acrílico">Acrílico</option>
            <option value="Algodón">Algodón</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="color">Color</label>
          <select name="color" id="color" onChange={handleChange}>
            <option value="">Todos</option>
            <option value="Rojo">Rojo</option>
            <option value="Azul">Azul</option>
            <option value="Negro">Negro</option>
            <option value="Natural">Natural</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="densidad">Densidad</label>
          <select name="densidad" id="densidad" onChange={handleChange}>
            <option value="">Todas</option>
            <option value="Fina">Fina</option>
            <option value="Media">Media</option>
            <option value="Gruesa">Gruesa</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="price">Precio Máximo</label>
          <input
            type="number"
            name="price"
            id="price"
            value={filters.price || ''}
            onChange={handleChange}
          />
        </div>

        <div className={styles.filterGroup}>
          <label>
            <input
              type="checkbox"
              name="inStock"
              checked={filters.inStock || false}
              onChange={handleChange}
            />
            Solo productos en stock
          </label>
        </div>

        <div className={styles.filterGroup}>
          <label>
            <input
              type="checkbox"
              name="enOferta"
              checked={filters.enOferta || false}
              onChange={handleChange}
            />
            Solo productos en oferta
          </label>
        </div>

        <div className={styles.filterGroup}>
          <label>
            <input
              type="checkbox"
              name="nuevos"
              checked={filters.nuevos || false}
              onChange={handleChange}
            />
            Solo nuevos ingresos
          </label>
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="ordenarPor">Ordenar por</label>
          <select name="ordenarPor" id="ordenarPor" onChange={handleChange}>
            <option value="">--</option>
            <option value="precioAsc">Precio: menor a mayor</option>
            <option value="precioDesc">Precio: mayor a menor</option>
            <option value="nombreAsc">Nombre A-Z</option>
            <option value="nombreDesc">Nombre Z-A</option>
          </select>
        </div>
      </div>
    </>
  );
};

export default SidebarFilters;
