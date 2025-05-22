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
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!isAdmin && <Navbar />}
      <div style={{ flex: '1' }}>
        <Component {...pageProps} />
      </div>
      {router.pathname !== '/login' && <Footer />}
    </div>
  );
}

export default MyApp;
