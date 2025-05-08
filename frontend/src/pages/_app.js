import '../styles/globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.rol === 'admin') {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    }
  }, [router.pathname]);

  return (
    <>
      {!isAdmin && <Navbar />}
      <Component {...pageProps} />
      {/* Mostrar Footer solo si no estamos en la página de Login */}
      {router.pathname !== '/login' && <Footer />}
    </>
  );
}

export default MyApp;
