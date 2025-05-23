const mongoose = require('mongoose');

const carritoSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  productos: [
    {
      productoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto' },
      nombre: String,
      cantidad: Number,
      precio: Number
    }
  ],
  creadoEn: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Carrito', carritoSchema);
