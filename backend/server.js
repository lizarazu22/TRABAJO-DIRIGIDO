const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { OpenAI } = require('openai');

dotenv.config();

if (!process.env.OPENAI_API_KEY) {
  console.error('Error: Falta la clave de OpenAI');
  process.exit(1);
}

connectDB();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const app = express();

app.use(cors());
app.use(express.json());

// Rutas API
app.use('/api/productos', require('./routes/products')); // Catálogo desde almacen_temp (puede quedar como respaldo)
app.use('/api/admin/productos', require('./routes/catalogo')); // Admin productos formal desde mongoose Product
app.use('/api/procesar', require('./routes/procesarAlmacenTemp')); // Migración formal de almacenTemp a Product
app.use('/api/auth', require('./routes/auth'));
app.use('/api/gpt', require('./routes/gpt'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/almacen_temp', require('./routes/almacen_temp'));
app.use('/api/carrito', require('./routes/carrito'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/ventas', require('./routes/ventas'));
app.use('/api/reset-password', require('./routes/resetPassword'));

app.get('/', (req, res) => res.send('API funcionando correctamente'));

app.use((err, req, res, next) => {
  console.error('Error interno:', err.stack);
  res.status(500).json({ message: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
