const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { OpenAI } = require('openai'); // Usar la versión correcta de OpenAI

// Cargar variables de entorno
dotenv.config();

// Verificar la clave de OpenAI
if (!process.env.OPENAI_API_KEY) {
  console.error('Error: Falta la clave de OpenAI en el archivo .env (OPENAI_API_KEY)');
  process.exit(1); // Salir de la aplicación si no hay clave
}

// Conectar a la base de datos
connectDB();

// Configuración de OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Clave de OpenAI desde el .env
});

// Inicializar la app Express
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/productos', require('./routes/products')); // Rutas de productos
app.use('/api/auth', require('./routes/auth'));          // Rutas de autenticación
app.use('/api/gpt', require('./routes/gpt'));            // Rutas para GPT-3
app.use('/api/upload', require('./routes/upload'));      // pa subir el excel


// Ruta raíz
app.get('/', (req, res) => {
  res.send('API en funcionamiento');
});

// Manejo de errores generales (middleware)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error interno del servidor' });
});

// Puerto del servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
