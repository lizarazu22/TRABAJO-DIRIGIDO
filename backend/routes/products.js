const express = require('express');
const router = express.Router();
const Producto = require('../models/product');

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ message: 'Error al obtener productos' });
  }
});

// Endpoint para asignar características random a todos los productos
router.get('/asignar-caracteristicas-random', async (req, res) => {
  try {
    const productos = await Producto.find();
    const categorias = ['Almohada', 'Colchón', 'Sábana', 'Cobija'];
    const materiales = ['Algodón', 'Espuma', 'Látex', 'Poliéster'];
    const colores = ['Blanco', 'Azul', 'Gris', 'Beige', 'Negro'];
    const densidades = ['Suave', 'Media', 'Firme'];

    for (let prod of productos) {
      prod.categoria = categorias[Math.floor(Math.random() * categorias.length)];
      prod.material = materiales[Math.floor(Math.random() * materiales.length)];
      prod.color = colores[Math.floor(Math.random() * colores.length)];
      prod.densidad = densidades[Math.floor(Math.random() * densidades.length)];
      await prod.save();
    }

    res.json({ message: 'Características asignadas correctamente.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error asignando características.' });
  }
});

module.exports = router;
