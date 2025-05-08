const express = require('express');
const router = express.Router();
const Venta = require('../models/venta');

// Obtener ventas por usuario
router.get('/por-usuario/:usuarioId', async (req, res) => {
  try {
    const ventas = await Venta.find({ usuarioId: req.params.usuarioId });
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener ventas', error });
  }
});

// Obtener ventas por rango de fechas
router.get('/por-fechas', async (req, res) => {
  const { desde, hasta } = req.query;
  try {
    const ventas = await Venta.find({
      fecha: {
        $gte: new Date(desde),
        $lte: new Date(hasta)
      }
    });
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener ventas por fechas', error });
  }
});

module.exports = router;
