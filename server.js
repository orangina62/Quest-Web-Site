const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const db = new sqlite3.Database('./missions.db');

// Middleware
app.use(express.json());

// Configurez CORS pour autoriser votre domaine Vercel
app.use(cors({
    origin: 'https://the-quest-board.vercel.app', // Remplacez par l'URL de votre frontend
    methods: ['GET', 'POST'], // Autorisez uniquement les méthodes nécessaires
    allowedHeaders: ['Content-Type']
}));

// Middleware pour logger les requêtes
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Créer la table des missions si elle n'existe pas
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS missions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            person TEXT NOT NULL,
            objective TEXT NOT NULL
        )
    `);
});

// Récupérer toutes les missions
app.get('/api/missions', (req, res) => {
    res.json({ message: 'Liste des missions' }); // Exemple de réponse pour tester
});

// Ajouter une nouvelle mission
app.post('/api/missions', (req, res) => {
    res.json({ message: 'Mission ajoutée' }); // Exemple de réponse pour tester
});

// Démarrer le serveur
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
    console.log('Assurez-vous que ce port est accessible et non utilisé par une autre application.');
});
