const Producto = require('../models/product');

// Obtener todos los productos
exports.getProducts = async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (error) {
    res.status(500).send('Error al obtener productos');
  }
};

// Añadir un nuevo producto
exports.addProduct = async (req, res) => {
  const { nombre, descripcion, precio, categoria, stock } = req.body;
  try {
    const nuevoProducto = new Producto({
      nombre,
      descripcion,
      precio,
      categoria,
      stock,
    });
    await nuevoProducto.save();
    res.json(nuevoProducto);
  } catch (error) {
    res.status(500).send('Error al crear producto');
  }
};
