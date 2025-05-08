import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../styles/Login.module.css';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error('Credenciales incorrectas.');

      const data = await response.json();

      localStorage.setItem('token', data.token);
      localStorage.setItem(
        'user',
        JSON.stringify({
          _id: data.user._id,
          nombre: data.user.nombre,
          email: data.user.email,
          rol: data.user.rol,
        })
      );

      if (data.user.rol === 'admin') {
        router.push('/admin/AdminDashboard');
      } else {
        router.push('/');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <div className={styles.avatar}></div>
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.options}>
          <label>
            <input type="checkbox" /> Remember me
          </label>
          <Link href={`/forgot-password?email=${encodeURIComponent(form.email)}`}>
            <span className={styles.forgotLink}>Forgot password?</span>
          </Link>
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.loginButton}>
          LOGIN
        </button>
        <button
          type="button"
          className={styles.registerButton}
          onClick={() => router.push('/signup')}
        >
          Registrarse
        </button>
      </form>
    </div>
  );
};

export default Login;
