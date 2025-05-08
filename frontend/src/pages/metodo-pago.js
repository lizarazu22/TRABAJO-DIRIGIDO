import Link from 'next/link';
import styles from '../styles/PaymentOptions.module.css';

const MetodoPago = () => {
  return (
    <div className={styles.paymentContainer}>
      <h1>Opciones de Pago</h1>
      <p>Selecciona el método de pago que prefieras:</p>
      
      <div className={styles.paymentMethods}>
        <div className={styles.paymentOption}>
          <h2>Pago con QR</h2>
          <p>Escanea este código QR con tu aplicación de pagos:</p>
          <img src="/images/qr-code.png" alt="Código QR de pago" />
        </div>
        
        <div className={styles.paymentOption}>
          <h2>Depósito Bancario</h2>
          <p>
            Realiza un depósito a la siguiente cuenta bancaria:
          </p>
          <ul>
            <li>Banco: Banco Ejemplo</li>
            <li>Cuenta: 1234567890</li>
            <li>Nombre: Ignacio Lizarazu</li>
          </ul>
        </div>
      </div>

      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <Link href="/cart" passHref>
          <button className={styles.cancelButton}>
            Cancelar Transacción
          </button>
        </Link>
      </div>
    </div>
  );
};

export default MetodoPago;
