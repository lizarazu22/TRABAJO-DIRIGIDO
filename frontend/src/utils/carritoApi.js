export const agregarAlCarrito = async (usuarioId, producto) => {
    try {
      const res = await fetch('http://localhost:5000/api/carrito/agregar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuarioId, producto })
      });
      return await res.json();
    } catch (error) {
      console.error('Error en agregarAlCarrito:', error);
      throw error;
    }
  };
  
  export const obtenerCarrito = async (usuarioId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/carrito/${usuarioId}`);
      return await res.json();
    } catch (error) {
      console.error('Error en obtenerCarrito:', error);
      throw error;
    }
  };
  
  export const vaciarCarrito = async (usuarioId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/carrito/${usuarioId}`, {
        method: 'DELETE'
      });
      return await res.json();
    } catch (error) {
      console.error('Error en vaciarCarrito:', error);
      throw error;
    }
  };
  