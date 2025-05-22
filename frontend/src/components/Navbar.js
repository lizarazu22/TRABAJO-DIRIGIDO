import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Navbar.module.css';
import { obtenerCarrito } from '../utils/carritoApi';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const user = JSON.parse(localStorage.getItem('user'));
      setIsLoggedIn(!!user);

      if (user) {
        obtenerCarrito(user._id).then(data => {
          const totalItems = data.productos.reduce((sum, item) => sum + item.cantidad, 0);
          setCartCount(totalItems);
        }).catch(() => setCartCount(0));
      } else {
        setCartCount(0);
      }
    };

    checkAuth();
    router.events.on('routeChangeComplete', checkAuth);
    return () => {
      router.events.off('routeChangeComplete', checkAuth);
    };
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    router.push('/login');
  };

  const isActive = (path) => router.pathname === path ? styles.activeLink : '';

  if (router.pathname === '/login' || router.pathname === '/signup') return null;

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>Textiles Copacabana</div>
      <ul className={styles.navLinks}>
        <li><Link href="/" className={isActive('/')}>Inicio</Link></li>
        <li><Link href="/catalog" className={isActive('/catalog')}>Catálogo</Link></li>
        <li><Link href="/cart" className={isActive('/cart')}>Carrito {cartCount > 0 && `(${cartCount})`}</Link></li>
      </ul>
      {isLoggedIn && (
        <div className={styles.logoutContainer}>
          <button onClick={handleLogout} className={styles.logoutButton}>Cerrar Sesión</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
