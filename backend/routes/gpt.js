const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');

// Inicializar OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Catálogo de materiales
const catalogo = [
  { id: 1, nombre: 'Cemento', descripcion: 'Material de construcción básico', precio: 20 },
  { id: 2, nombre: 'Ladrillo', descripcion: 'Bloque de arcilla para construcción', precio: 15 },
  { id: 3, nombre: 'Madera', descripcion: 'Material para estructuras y acabados', precio: 50 },
  { id: 4, nombre: 'Pintura', descripcion: 'Pintura para paredes y superficies', precio: 25 },
];

// Endpoint para búsqueda con GPT-3
router.post('/buscar', async (req, res) => {
  const { solicitud } = req.body;

  if (!solicitud) {
    return res.status(400).json({ message: 'La solicitud es requerida' });
  }

  try {
    // Solicitud a OpenAI para procesar la solicitud del usuario
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Modelo GPT-3.5 Turbo
      messages: [
        {
          role: 'system',
          content: `Eres un asistente que recomienda materiales del catálogo basado en solicitudes.`,
        },
        {
          role: 'user',
          content: `Catálogo de materiales: ${JSON.stringify(
            catalogo
          )}. Solicitud: ${solicitud}`,
        },
      ],
    });

    const materialesRecomendados = response.choices[0].message.content.trim();

    res.status(200).json({
      message: 'Materiales sugeridos',
      sugerencias: materialesRecomendados,
    });
  } catch (error) {
    console.error('Error al interactuar con OpenAI:', error.message);
    res.status(500).json({ message: 'Error interno al procesar la solicitud' });
  }
});

module.exports = router;
