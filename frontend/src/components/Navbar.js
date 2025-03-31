import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Navbar.module.css';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Verificar si el usuario está logueado al cargar la página
    const userLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(userLoggedIn);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    router.push('/login'); // Redirigir al Login
  };

  return (
    <nav className={styles.navbar}>
      <ul className={styles.navList}>
        <li>
          <Link href="/" className={router.pathname === '/' ? styles.active : ''}>
            Inicio
          </Link>
        </li>
        <li>
          <Link href="/catalog" className={router.pathname === '/catalog' ? styles.active : ''}>
            Catálogo
          </Link>
        </li>
        <li>
          <Link href="/cart" className={router.pathname === '/cart' ? styles.active : ''}>
            Carrito
          </Link>
        </li>
        {isLoggedIn ? (
          <li className={styles.logout}>
            <button onClick={handleLogout} className={`${styles.navLink} ${styles.logoutButton}`}>
              Logout
            </button>
          </li>
        ) : (
          <li>
            <Link href="/login" className={router.pathname === '/login' ? styles.active : ''}>
              Login
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
