import { useState } from 'react';
import { signupUser } from '../utils/api';
import { useRouter } from 'next/router';
import styles from '../styles/Login.module.css';

const Signup = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signupUser(nombre, email, password);
      alert('Registro exitoso');
      router.push('/login');
    } catch (error) {
      setError('Error al registrar usuario');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Registrarse</h1>
        <div>
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" className={styles.loginButton}>
          Registrarse
        </button>
        <button
          type="button"
          className={styles.registerButton}
          onClick={() => router.push('/login')}
        >
          Volver al Login
        </button>
      </form>
    </div>
  );
};

export default Signup;
