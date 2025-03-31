import '../styles/globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  return (
    <>
      <Navbar />
      <Component {...pageProps} />
      {/* Mostrar Footer solo si no estamos en la página de Login */}
      {router.pathname !== '/login' && <Footer />}
    </>
  );
}

export default MyApp;
