const Producto = require('../models/product');
const AlmacenTemp = require('../models/almacen_temp');

// Obtener todos los productos
exports.getProducts = async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (error) {
    res.status(500).send('Error al obtener productos');
  }
};

// Crear un nuevo producto
exports.addProduct = async (req, res) => {
  const { nombre, descripcion = '', precio, categoria = 'General', stock = 0, imagenes = [] } = req.body;
  try {
    const nuevoProducto = new Producto({
      nombre,
      descripcion,
      precio,
      categoria,
      stock,
      imagenes
    });
    await nuevoProducto.save();
    res.json(nuevoProducto);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al crear producto');
  }
};

// Editar un producto
exports.updateProduct = async (req, res) => {
  try {
    const productoActualizado = await Producto.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(productoActualizado);
  } catch (error) {
    res.status(500).send('Error al actualizar producto');
  }
};

// Eliminar un producto
exports.deleteProduct = async (req, res) => {
  try {
    await Producto.findByIdAndDelete(req.params.id);
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).send('Error al eliminar producto');
  }
};

// Migrar productos desde AlmacenTemp a Productos
exports.migrarDesdeAlmacenTemp = async (req, res) => {
  try {
    const registros = await AlmacenTemp.find();
    const nuevosProductos = [];

    registros.forEach(registro => {
      registro.data.forEach(item => {
        if (item['__EMPTY_5'] && item['__EMPTY_9']) {
          nuevosProductos.push({
            nombre: item['__EMPTY_5'],
            descripcion: 'Cargado desde Excel',
            precio: parseFloat(
              typeof item['__EMPTY_9'] === 'string'
                ? item['__EMPTY_9'].toString().replace(/[^\d.-]/g, '')
                : item['__EMPTY_9']
            ) || 0,
            categoria: 'General',
            stock: parseFloat(item['__EMPTY_8']) || 0,
            imagenes: [],
          });
        }
      });
    });

    if (nuevosProductos.length === 0) {
      return res.status(400).json({ message: 'No se encontraron productos válidos para migrar' });
    }

    await Producto.insertMany(nuevosProductos);
    res.status(200).json({ message: 'Productos migrados correctamente', cantidad: nuevosProductos.length });
  } catch (error) {
    console.error('Error migrando productos:', error);
    res.status(500).json({ message: 'Error al migrar productos', error });
  }
};
