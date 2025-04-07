const express = require('express');
const { createClient } = require('@vercel/edge-config');
const cors = require('cors');

const app = express();
const edgeConfig = createClient(process.env.EDGE_CONFIG); // Utilisez l'ID Edge Config depuis les variables d'environnement

// Middleware
app.use(express.json());
app.use(cors());

// Clé pour stocker les missions dans Edge Config
const MISSIONS_KEY = 'missions';

// Récupérer toutes les missions
app.get('/api/missions', async (req, res) => {
    try {
        const missions = await edgeConfig.get(MISSIONS_KEY);
        res.json(missions || []); // Retourne un tableau vide si aucune mission n'est trouvée
    } catch (err) {
        console.error('Erreur lors de la récupération des missions:', err.message);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

// Ajouter une nouvelle mission
app.post('/api/missions', async (req, res) => {
    const { name, person, objective } = req.body;

    if (!name || !person || !objective) {
        res.status(400).json({ error: 'Tous les champs sont obligatoires.' });
        return;
    }

    try {
        const missions = (await edgeConfig.get(MISSIONS_KEY)) || [];
        const newMission = { id: Date.now(), name, person, objective };
        missions.push(newMission);

        await edgeConfig.set(MISSIONS_KEY, missions); // Met à jour les missions dans Edge Config
        res.json(newMission);
    } catch (err) {
        console.error('Erreur lors de l\'ajout de la mission:', err.message);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

// Exporter l'application pour Vercel
module.exports = app;
