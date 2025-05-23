const Venta = require('../models/venta');
const Producto = require('../models/product');
const Carrito = require('../models/carrito');
const Usuario = require('../models/user');

// Crear venta con comprobante obligatorio
exports.crearVenta = async (req, res) => {
  try {
    const { usuarioId, productos, fecha } = req.body;
    if (!usuarioId || !productos || productos.length === 0) {
      return res.status(400).json({ message: 'Faltan datos para registrar la venta.' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Debes adjuntar una imagen del comprobante de pago.' });
    }

    const productosArray = typeof productos === 'string' ? JSON.parse(productos) : productos;

    let totalVenta = 0;
    for (const item of productosArray) {
      const productoDb = await Producto.findById(item.productoId);
      if (!productoDb) return res.status(404).json({ message: `Producto no encontrado: ${item.nombre}` });
      if (productoDb.stock < item.cantidad) {
        return res.status(400).json({ message: `Stock insuficiente para ${productoDb.nombre}` });
      }
      productoDb.stock -= item.cantidad;
      await productoDb.save();
      totalVenta += item.precio * item.cantidad;
    }

    const comprobante = req.file ? req.file.path : null;

    const venta = new Venta({
      usuarioId,
      productos: productosArray.map(p => ({ nombre: p.nombre, precio: p.precio, cantidad: p.cantidad })),
      total: totalVenta,
      comprobante,
      fecha: fecha ? new Date(fecha) : Date.now()
    });

    await venta.save();
    await Carrito.findOneAndDelete({ usuarioId });

    res.status(201).json({ message: 'Venta registrada correctamente.', venta });
  } catch (error) {
    console.error('Error registrando venta:', error);
    res.status(500).json({ message: 'Error al registrar venta', error });
  }
};

// Obtener ventas por usuario
exports.obtenerVentasPorUsuario = async (req, res) => {
  try {
    const ventas = await Venta.find({ usuarioId: req.params.usuarioId });
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener ventas', error });
  }
};

// Obtener ventas por fechas
exports.obtenerVentasPorFechas = async (req, res) => {
  const { desde, hasta } = req.query;
  try {
    if (!desde || !hasta) return res.status(400).json({ message: 'Debes proporcionar ambas fechas' });
    const ventas = await Venta.find({ fecha: { $gte: new Date(desde), $lte: new Date(hasta) } });
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener ventas por fechas', error });
  }
};

// Obtener todas las ventas
exports.obtenerTodasLasVentas = async (req, res) => {
  try {
    const ventas = await Venta.find();
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener todas las ventas', error });
  }
};

// Ventas por usuario y fechas
exports.obtenerVentasPorUsuarioYFechas = async (req, res) => {
  const { usuarioId, desde, hasta } = req.query;
  try {
    const filtro = {};
    if (usuarioId) filtro.usuarioId = usuarioId;
    if (desde && hasta) filtro.fecha = { $gte: new Date(desde), $lte: new Date(hasta) };
    const ventas = await Venta.find(filtro);
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener ventas', error });
  }
};

// Cierre de caja
exports.obtenerCierreCaja = async (req, res) => {
  const { desde, hasta } = req.query;
  try {
    if (!desde || !hasta) return res.status(400).json({ message: 'Debes proporcionar ambas fechas' });
    const ventas = await Venta.find({ fecha: { $gte: new Date(desde), $lte: new Date(hasta) } });
    const totalVentas = ventas.reduce((sum, v) => sum + (v.total || 0), 0);
    res.json({ ventas, totalVentas });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener cierre de caja', error });
  }
};

// Resumen mensual
exports.resumenMensual = async (req, res) => {
  const { mes, mesAnterior } = req.query;
  try {
    const [anio, mesNum] = mes.split('-');
    const desde = new Date(anio, mesNum - 1, 1);
    const hasta = new Date(anio, mesNum, 0, 23, 59, 59);
    const ventasMes = await Venta.find({ fecha: { $gte: desde, $lte: hasta } });
    const totalMes = ventasMes.reduce((sum, v) => sum + (v.total || 0), 0);

    let totalMesAnterior = 0;
    if (mesAnterior) {
      const [anioAnt, mesAntNum] = mesAnterior.split('-');
      const desdeAnt = new Date(anioAnt, mesAntNum - 1, 1);
      const hastaAnt = new Date(anioAnt, mesAntNum, 0, 23, 59, 59);
      const ventasAnt = await Venta.find({ fecha: { $gte: desdeAnt, $lte: hastaAnt } });
      totalMesAnterior = ventasAnt.reduce((sum, v) => sum + (v.total || 0), 0);
    }

    res.json({
      totalMes,
      totalMesAnterior,
      variacion: totalMesAnterior ? ((totalMes - totalMesAnterior) / totalMesAnterior) * 100 : 0,
      ventasMes
    });
  } catch (err) {
    res.status(500).json({ message: 'Error obteniendo resumen mensual', error: err });
  }
};

// Recalcular totales
exports.recalcularTotales = async (req, res) => {
  try {
    const ventas = await Venta.find();
    for (let venta of ventas) {
      const totalNuevo = venta.productos.reduce((sum, p) => sum + (p.precio * p.cantidad), 0);
      venta.total = totalNuevo;
      await venta.save();
    }
    res.json({ message: 'Totales actualizados correctamente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al recalcular totales', error });
  }
};

// Cambiar estado y reponer stock si es rechazado
exports.cambiarEstadoVenta = async (req, res) => {
  try {
    const { estado } = req.body;
    const venta = await Venta.findById(req.params.id);
    if (!venta) return res.status(404).json({ message: 'Venta no encontrada' });

    // Si se rechaza y estaba en standby, reponer stock
    if (estado === 'rechazado' && venta.estado === 'standby') {
      for (let item of venta.productos) {
        const productoDb = await Producto.findOne({ nombre: item.nombre });
        if (productoDb) {
          productoDb.stock += item.cantidad;
          await productoDb.save();
        }
      }
    }

    venta.estado = estado;
    await venta.save();

    res.json({ message: 'Estado actualizado', venta });
  } catch (error) {
    res.status(500).json({ message: 'Error actualizando estado', error });
  }
};

// Top comprador único
exports.topComprador = async (req, res) => {
  try {
    const resultado = await Venta.aggregate([
      { $group: { _id: "$usuarioId", totalGastado: { $sum: "$total" }, cantidadCompras: { $sum: 1 } } },
      { $sort: { totalGastado: -1 } },
      { $limit: 1 }
    ]);
    if (resultado.length === 0) return res.status(404).json({ message: 'No hay ventas registradas.' });
    res.json(resultado[0]);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener top comprador', error });
  }
};

// Top 3 compradores
exports.topCompradores = async (req, res) => {
  try {
    const resultado = await Venta.aggregate([
      { $group: { _id: "$usuarioId", totalGastado: { $sum: "$total" }, cantidadCompras: { $sum: 1 } } },
      { $sort: { totalGastado: -1 } },
      { $limit: 3 }
    ]);

    const ranking = await Promise.all(resultado.map(async (r) => {
      const usuario = await Usuario.findById(r._id);
      return {
        email: usuario ? usuario.email : 'Usuario eliminado',
        totalGastado: r.totalGastado,
        cantidadCompras: r.cantidadCompras
      };
    }));

    res.json(ranking);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener ranking', error });
  }
};
