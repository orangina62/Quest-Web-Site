const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Clé pour stocker les missions (remplacez Edge Config par une simple variable en mémoire)
const missions = [];

// Récupérer toutes les missions
app.get('/api/missions', (req, res) => {
    res.json(missions); // Retourne les missions stockées en mémoire
});

// Ajouter une nouvelle mission
app.post('/api/missions', (req, res) => {
    const { name, person, objective } = req.body;

    if (!name || !person || !objective) {
        res.status(400).json({ error: 'Tous les champs sont obligatoires.' });
        return;
    }

    const newMission = { id: Date.now(), name, person, objective };
    missions.push(newMission); // Ajoute la mission à la liste en mémoire
    res.json(newMission);
});

// Exporter l'application pour Vercel
module.exports = app;
