const express = require('express');
const { Pool } = require('pg'); // Client PostgreSQL
const cors = require('cors');

const app = express();

// Configuration de la base de données
const pool = new Pool({
    user: 'votre_utilisateur',
    host: 'votre_hote',
    database: 'votre_base_de_donnees',
    password: 'votre_mot_de_passe',
    port: 5432, // Port par défaut pour PostgreSQL
});

// Middleware
app.use(express.json());
app.use(cors());

// Récupérer toutes les missions
app.get('/api/missions', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM missions');
        res.json(result.rows);
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
        const result = await pool.query(
            'INSERT INTO missions (name, person, objective) VALUES ($1, $2, $3) RETURNING id',
            [name, person, objective]
        );
        res.json({ id: result.rows[0].id });
    } catch (err) {
        console.error('Erreur lors de l\'ajout de la mission:', err.message);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

// Exporter l'application pour Vercel
module.exports = app;
