const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');
const AlmacenTemp = require('../models/almacen_temp');
const Catalogo = require('../models/catalogo'); // <- CORREGIDO

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No se ha subido ningún archivo' });

    const workbook = xlsx.readFile(req.file.path);
    const sheet = workbook.Sheets['BD VENTAS'];
    const data = xlsx.utils.sheet_to_json(sheet);

    // Limpiar catálogo actual
    await Catalogo.deleteMany();

    // Extraer productos únicos y guardarlos en Catalogo
    const productosUnicos = [];

    data.forEach(item => {
      if (item.Producto && item.Precio !== undefined) {
        if (!productosUnicos.some(p => p.producto === item.Producto)) {
          productosUnicos.push({
            producto: item.Producto,
            color: item.Color || 'N/A',
            cantidad: item.Cantidad || 0,
            precio: item.Precio
          });
        }
      }
    });

    await Catalogo.insertMany(productosUnicos);

    await AlmacenTemp.create({ data });

    fs.unlinkSync(req.file.path);

    res.json({ message: 'Datos cargados, catálogo actualizado y almacenados en JSON temporal' });
  } catch (error) {
    console.error('Error al procesar el archivo:', error);
    res.status(500).json({ message: 'Error al subir el archivo' });
  }
});

module.exports = router;
