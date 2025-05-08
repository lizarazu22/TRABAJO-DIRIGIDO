const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Carrito = require('../models/carrito');

// Agregar producto al carrito
router.post('/agregar', async (req, res) => {
  const { usuarioId, producto } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(usuarioId)) {
      return res.status(400).json({ message: 'usuarioId inválido' });
    }

    if (!mongoose.Types.ObjectId.isValid(producto.productoId)) {
      return res.status(400).json({ message: 'productoId inválido' });
    }

    const objectUserId = new mongoose.Types.ObjectId(usuarioId);

    let carrito = await Carrito.findOne({ usuarioId: objectUserId });

    if (!carrito) {
      carrito = new Carrito({
        usuarioId: objectUserId,
        productos: [producto]
      });
    } else {
      carrito.productos.push(producto);
    }

    await carrito.save();
    res.status(200).json({ message: 'Producto agregado al carrito', carrito });

  } catch (err) {
    console.error('Error al agregar producto:', err);
    res.status(500).json({ message: 'Error al agregar producto', error: err });
  }
});

// Obtener carrito de un usuario
router.get('/:usuarioId', async (req, res) => {
  try {
    const { usuarioId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(usuarioId)) {
      return res.status(400).json({ message: 'usuarioId inválido' });
    }

    const objectUserId = new mongoose.Types.ObjectId(usuarioId);

    const carrito = await Carrito.findOne({ usuarioId: objectUserId });
    if (!carrito) return res.status(200).json({ productos: [] });

    res.status(200).json(carrito);
  } catch (err) {
    console.error('Error al obtener carrito:', err);
    res.status(500).json({ message: 'Error al obtener carrito', error: err });
  }
});

// Vaciar carrito
router.delete('/:usuarioId', async (req, res) => {
  try {
    const { usuarioId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(usuarioId)) {
      return res.status(400).json({ message: 'usuarioId inválido' });
    }

    const objectUserId = new mongoose.Types.ObjectId(usuarioId);

    await Carrito.deleteOne({ usuarioId: objectUserId });
    res.status(200).json({ message: 'Carrito vaciado' });
  } catch (err) {
    res.status(500).json({ message: 'Error al vaciar carrito', error: err });
  }
});

// Eliminar producto específico del carrito
router.delete('/:usuarioId/producto/:productoId', async (req, res) => {
  const { usuarioId, productoId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(usuarioId)) {
      return res.status(400).json({ message: 'usuarioId inválido' });
    }

    if (!mongoose.Types.ObjectId.isValid(productoId)) {
      return res.status(400).json({ message: 'productoId inválido' });
    }

    const objectUserId = new mongoose.Types.ObjectId(usuarioId);

    const carrito = await Carrito.findOne({ usuarioId: objectUserId });

    if (!carrito) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    carrito.productos = carrito.productos.filter(
      p => p.productoId.toString() !== productoId
    );

    await carrito.save();
    res.status(200).json({ message: 'Producto eliminado del carrito', carrito });

  } catch (err) {
    console.error('Error eliminando producto:', err);
    res.status(500).json({ message: 'Error al eliminar producto', error: err });
  }
});

module.exports = router;
