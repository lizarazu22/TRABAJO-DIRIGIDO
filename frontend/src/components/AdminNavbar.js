import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/AdminNavbar.module.css';

const AdminNavbar = () => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>Admin Panel</div>
      <ul className={styles.navLinks}>
        <li><Link href="/admin/Usuarios">Usuarios</Link></li>
        <li><Link href="/admin/Ventas">Ventas</Link></li>
        <li><Link href="/admin/Productos">Productos</Link></li>
        <li><Link href="/admin/ExcelUpload">Subir Excel</Link></li>
        <li><Link href="/admin/Reporte">Reporte</Link></li>
        <li><Link href="/admin/Gastos">Gastos</Link></li>
      </ul>
      <button onClick={handleLogout} className={styles.logoutButton}>Cerrar Sesión</button>
    </nav>
  );
};

export default AdminNavbar;
