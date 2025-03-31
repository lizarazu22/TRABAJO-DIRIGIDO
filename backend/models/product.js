const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  precio: { type: Number, required: true },
  categoria: { type: String, required: true },
  stock: { type: Number, default: 0 },
  imagenes: [String],
  creadoEn: { type: Date, default: Date.now },
});

const Producto = mongoose.model('Producto', productSchema);
module.exports = Producto;
