const express = require('express');
const router = express.Router();
const Producto = require('../models/product');

// Obtener todos los productos desde la colección formal
router.get('/', async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ message: 'Error al obtener productos' });
  }
});

module.exports = router;
