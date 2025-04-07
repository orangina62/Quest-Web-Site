const express = require('express');
const Database = require('better-sqlite3'); // Remplace sqlite3 par better-sqlite3
const cors = require('cors');

const app = express();
const db = new Database('./api/missions.db'); // Assurez-vous que le chemin est correct

// Middleware
app.use(express.json());

// Configurez CORS pour autoriser votre domaine Vercel
app.use(cors({
    origin: 'https://the-quest-board.vercel.app', // Remplacez par l'URL de votre frontend
    methods: ['GET', 'POST'], // Autorisez uniquement les méthodes nécessaires
    allowedHeaders: ['Content-Type']
}));

// Créer la table des missions si elle n'existe pas
db.prepare(`
    CREATE TABLE IF NOT EXISTS missions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        person TEXT NOT NULL,
        objective TEXT NOT NULL
    )
`).run();

// Récupérer toutes les missions
app.get('/api/missions', (req, res) => {
    try {
        const rows = db.prepare('SELECT * FROM missions').all();
        res.json(rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des missions:', err.message);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

// Ajouter une nouvelle mission
app.post('/api/missions', (req, res) => {
    const { name, person, objective } = req.body;

    if (!name || !person || !objective) {
        res.status(400).json({ error: 'Tous les champs sont obligatoires.' });
        return;
    }

    try {
        const result = db.prepare(
            'INSERT INTO missions (name, person, objective) VALUES (?, ?, ?)'
        ).run(name, person, objective);
        res.json({ id: result.lastInsertRowid });
    } catch (err) {
        console.error('Erreur lors de l\'ajout de la mission:', err.message);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
});

// Exporter l'application pour Vercel
module.exports = app;
