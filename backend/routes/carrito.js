const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Carrito = require('../models/carrito');
const Producto = require('../models/product');

// Agregar producto al carrito
router.post('/agregar', async (req, res) => {
  const { usuarioId, producto } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(usuarioId) || !mongoose.Types.ObjectId.isValid(producto.productoId)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const prod = await Producto.findById(producto.productoId);
    if (!prod) return res.status(404).json({ message: 'Producto no encontrado' });
    if (prod.stock < producto.cantidad) {
      return res.status(400).json({ message: 'Cantidad solicitada supera el stock disponible.' });
    }

    const carrito = await Carrito.findOneAndUpdate(
      { usuarioId },
      { $setOnInsert: { usuarioId, productos: [] } },
      { upsert: true, new: true }
    );

    const existente = carrito.productos.find(p => p.productoId.toString() === producto.productoId);
    if (existente) {
      existente.cantidad += producto.cantidad;
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

// Obtener carrito de un usuario con stock actualizado
router.get('/:usuarioId', async (req, res) => {
  try {
    const { usuarioId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(usuarioId)) {
      return res.status(400).json({ message: 'usuarioId inválido' });
    }

    const carrito = await Carrito.findOne({ usuarioId });
    if (!carrito) return res.status(200).json({ productos: [] });

    const productosConStock = await Promise.all(
      carrito.productos.map(async (item) => {
        const prod = await Producto.findById(item.productoId);
        return {
          ...item.toObject(),
          stock: prod ? prod.stock : 0
        };
      })
    );

    res.status(200).json({
      _id: carrito._id,
      usuarioId: carrito.usuarioId,
      creadoEn: carrito.creadoEn,
      productos: productosConStock
    });

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
    await Carrito.deleteOne({ usuarioId });
    res.status(200).json({ message: 'Carrito vaciado' });
  } catch (err) {
    res.status(500).json({ message: 'Error al vaciar carrito', error: err });
  }
});

// Eliminar producto específico del carrito
router.delete('/:usuarioId/producto/:productoId', async (req, res) => {
  const { usuarioId, productoId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(usuarioId) || !mongoose.Types.ObjectId.isValid(productoId)) {
      return res.status(400).json({ message: 'IDs inválidos' });
    }

    const carrito = await Carrito.findOne({ usuarioId });
    if (!carrito) return res.status(404).json({ message: 'Carrito no encontrado' });

    carrito.productos = carrito.productos.filter(p => p.productoId.toString() !== productoId);
    await carrito.save();

    res.status(200).json({ message: 'Producto eliminado del carrito', carrito });
  } catch (err) {
    console.error('Error eliminando producto:', err);
    res.status(500).json({ message: 'Error al eliminar producto', error: err });
  }
});

// Actualizar cantidad de un producto en carrito
router.put('/:usuarioId/producto/:productoId', async (req, res) => {
  try {
    const { usuarioId, productoId } = req.params;
    const { cantidad } = req.body;

    const carrito = await Carrito.findOne({ usuarioId });
    if (!carrito) return res.status(404).json({ message: 'Carrito no encontrado' });

    const productoEnCarrito = carrito.productos.find(p => p.productoId.toString() === productoId);
    if (!productoEnCarrito) return res.status(404).json({ message: 'Producto no encontrado en el carrito' });

    const prod = await Producto.findById(productoId);
    if (!prod || prod.stock < cantidad) {
      return res.status(400).json({ message: 'Stock insuficiente para esta cantidad.' });
    }

    productoEnCarrito.cantidad = cantidad;
    await carrito.save();

    res.json({ message: 'Cantidad actualizada correctamente', carrito });
  } catch (error) {
    console.error('Error actualizando cantidad:', error);
    res.status(500).json({ message: 'Error actualizando cantidad' });
  }
});

module.exports = router;
