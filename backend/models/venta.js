const mongoose = require('mongoose');

const ventaSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  productos: [
    {
      nombre: String,
      precio: Number,
      cantidad: Number
    }
  ],
  total: Number,
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Venta', ventaSchema);
