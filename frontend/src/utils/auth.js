export const isAuthenticated = () => {
    return !!localStorage.getItem('token'); // Devuelve true si existe un token
  };
  
  export const logout = () => {
    localStorage.removeItem('token'); // Elimina el token
  };
  