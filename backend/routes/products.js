const express = require('express');
const router = express.Router();
const AlmacenTemp = require('../models/almacen_temp');  // usamos almacen_temp

// Obtener todos los productos del almacentemp
router.get('/', async (req, res) => {
  try {
    const registros = await AlmacenTemp.find();
    const productos = [];

    registros.forEach(registro => {
      registro.data.forEach((p, index) => {
        // Solo productos válidos (que tengan nombre y precio)
        if (p['Producto'] && p['PRECIO'] !== undefined) {
          productos.push({
            _id: `${registro._id}-${index}`,  // Id único por registro y posición
            nombre: p['Producto'] || 'Sin nombre',
            precio: parseFloat(
              typeof p['PRECIO'] === 'string'
                ? p['PRECIO'].toString().replace(/[^\d.-]/g, "")
                : p['PRECIO']
            ) || 0,
            color: p['COLOR'] || 'Sin color',
            stock: parseFloat(p['CONOS EN ALMACEN']) || 0
          });
        }
      });
    });

    res.json(productos);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({ message: 'Error al obtener productos' });
  }
});

module.exports = router;
