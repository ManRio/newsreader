const express = require('express');
const axios = require('axios');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const User = require('../models/User');

router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || !user.interests || user.interests.length === 0) {
      return res
        .status(400)
        .json({ message: 'Debes configurar tus intereses primero.' });
    }

    // Crear consulta basada en intereses
    const query = user.interests.join(' OR '); // ejemplo: "technology OR sports OR science"

    const response = await axios.get(`https://newsapi.org/v2/everything`, {
      params: {
        q: query,
        language: 'en',
        sortBy: 'publishedAt',
        apiKey: process.env.NEWS_API_KEY,
        pageSize: 10,
      },
    });

    res.status(200).json({
      articles: response.data.articles,
    });
  } catch (error) {
    console.error('Error al obtener noticias:', error.message);
    res
      .status(500)
      .json({ message: 'Error al obtener noticias personalizadas' });
  }
});

router.post('/save', authMiddleware, async (req, res) => {
  try {
    const { articleId } = req.body;

    if (!articleId) {
      return res
        .status(400)
        .json({ message: 'Debes enviar el ID o URL del artículo.' });
    }

    const user = await User.findById(req.user.id);

    // Evitar duplicados
    if (user.saved_articles.includes(articleId)) {
      return res
        .status(400)
        .json({ message: 'Este artículo ya está guardado.' });
    }

    user.saved_articles.push(articleId);
    await user.save();

    res.status(200).json({ message: 'Artículo guardado correctamente.' });
  } catch (error) {
    console.error('Error al guardar artículo:', error.message);
    res.status(500).json({ message: 'Error del servidor.' });
  }
});

router.get('/saved', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      saved_articles: user.saved_articles,
    });
  } catch (error) {
    console.error('Error al obtener artículos guardados:', error.message);
    res.status(500).json({ message: 'Error del servidor.' });
  }
});

// POST: añadir artículo al historial
router.post('/history', authMiddleware, async (req, res) => {
  try {
    const { articleId } = req.body;

    if (!articleId) {
      return res.status(400).json({ message: 'Debes enviar un articleId.' });
    }

    const user = await User.findById(req.user.id);

    // Evitar duplicados (opcional)
    if (!user.read_history.includes(articleId)) {
      user.read_history.push(articleId);
      await user.save();
    }

    res.status(200).json({ message: 'Artículo añadido al historial.' });
  } catch (error) {
    console.error('Error al guardar historial:', error.message);
    res.status(500).json({ message: 'Error del servidor.' });
  }
});

// GET: obtener historial
router.get('/history', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      read_history: user.read_history,
    });
  } catch (error) {
    console.error('Error al obtener historial:', error.message);
    res.status(500).json({ message: 'Error del servidor.' });
  }
});

// PUT: actualizar intereses
router.put('/interests', authMiddleware, async (req, res) => {
  console.log('Middleware pasó, entrando en PUT /interests ✅'); // 👈 Nuevo log
  console.log('req.user:', req.user); // 👈 Aquí sí o sí queremos ver qué trae

  try {
    const { interests } = req.body;

    if (!interests || interests.length === 0) {
      return res
        .status(400)
        .json({ message: 'Debes enviar al menos un interés.' });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    user.interests = interests;
    await user.save();

    res.status(200).json({ message: 'Intereses actualizados correctamente.' });
  } catch (error) {
    console.error('Error en PUT /interests:', error); // 🔥 Mostramos el error completo, no solo message
    res.status(500).json({ message: 'Error del servidor' });
  }
});

module.exports = router;
