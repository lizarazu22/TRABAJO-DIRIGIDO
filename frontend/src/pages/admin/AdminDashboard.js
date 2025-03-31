import { useState } from 'react';
import axios from 'axios';
import styles from '../../styles/AdminDashboard.module.css';

const AdminDashboard = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Por favor, selecciona un archivo.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error al subir el archivo');
    }
  };

  return (
    <div className={styles.adminContainer}>
      <h1>Panel de Administrador</h1>
      <input type="file" className={styles.inputField} onChange={handleFileChange} />
      <button className={styles.uploadButton} onClick={handleUpload}>
        Subir Archivo
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AdminDashboard;
