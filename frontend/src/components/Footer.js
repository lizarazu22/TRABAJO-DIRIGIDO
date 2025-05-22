const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#1f2937',
      color: '#f3f4f6',
      padding: '20px 0',
      textAlign: 'center',
      fontSize: '0.95rem',
      marginTop: '20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <p>&copy; {new Date().getFullYear()} Tienda Textil Copacabana — Todos los derechos reservados.</p>
        <p style={{ marginTop: '8px', fontSize: '0.85rem', color: '#9ca3af' }}>
          Desarrollado por textilescopacabana | El Alto, Bolivia
        </p>
      </div>
    </footer>
  );
};

export default Footer;
