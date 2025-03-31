const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs'); // Agregado para manejar archivos temporales
const Producto = require('../models/product');

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Carpeta temporal donde se guardarán los archivos

router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se ha subido ningún archivo' });
    }

    // Leer el archivo Excel
    const workbook = xlsx.readFile(req.file.path);
    const sheet = workbook.Sheets['ALMACEN']; // Nombre de la hoja de Excel
    const data = xlsx.utils.sheet_to_json(sheet);

    // Convertir datos del Excel a formato de productos
    const productos = data.map(row => ({
      nombre: row['Producto'],
      categoria: row['TITULO'],
      stock: row['CONOS EN ALMACEN'],
    }));

    await Producto.insertMany(productos);

    // 🔴 Eliminar el archivo después de procesarlo
    fs.unlinkSync(req.file.path);

    res.json({ message: 'Productos subidos correctamente' });
  } catch (error) {
    console.error('Error al procesar el archivo:', error);
    res.status(500).json({ message: 'Error al subir el archivo' });
  }
});

module.exports = router;
