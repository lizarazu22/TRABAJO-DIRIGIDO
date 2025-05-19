import styles from '../styles/Home.module.css';
import withAuth from '../middlewares/withAuth';

const Home = () => {
  return (
    <div>
      <div className={styles.hero}>
        <div>
          <h1>Textiles Copacabana</h1>
          <p>Fabricamos hilos de fibras naturales y sintéticas, con materia prima nacional.</p>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Compromiso y Calidad</h2>
        <p>
          Cuidamos la densidad, dirección del giro, resistencia y aspecto del hilo para ofrecer productos de excelente calidad.
        </p>
      </div>

      <div className={styles.section}>
        <h2>Nosotros</h2>
        <p>
          Empresa boliviana situada en El Alto, parte del Grupo Pomier. Inició en 1995 para cubrir la falta de hilos y telas artesanales, consolidándose como referente nacional.
        </p>
      </div>

      <div className={styles.section}>
        <h2>Valores</h2>
        <ul className={styles.list}>
          <li>Ética</li>
          <li>Honestidad</li>
          <li>Respeto</li>
          <li>Verdad</li>
        </ul>
      </div>

      <div className={styles.section}>
        <h2>Algunas Cifras</h2>
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <h3>15</h3>
            <p>Reconocimientos</p>
          </div>
          <div className={styles.statItem}>
            <h3>25+</h3>
            <p>Distribuidores</p>
          </div>
          <div className={styles.statItem}>
            <h3>140+</h3>
            <p>Clientes Nacionales</p>
          </div>
          <div className={styles.statItem}>
            <h3>13+</h3>
            <p>Clientes Extranjeros</p>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Contacto</h2>
        <p>
          📞 (591) 772 45533 | (591) 285 2122 | (591) 246 3580
        </p>
        <p>
          📧 <a href="mailto:info@textilescopacabana.com">info@textilescopacabana.com</a> / <a href="mailto:fibrasbolivianas@gmail.com">fibrasbolivianas@gmail.com</a>
        </p>
        <p>
          📍 <a href="https://www.google.com/maps/place/Calle+Illampu+853,+La+Paz,+Bolivia" target="_blank" rel="noopener noreferrer">
            Calle Illampu Nro. 853 casi esquina Sagárnaga, La Paz - Bolivia
          </a>
        </p>
      </div>
    </div>
  );
};

export default withAuth(Home);
