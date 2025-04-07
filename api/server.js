const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const db = new sqlite3.Database('./api/missions.db'); // Assurez-vous que le chemin est correct

// Middleware
app.use(express.json());
app.use(cors());

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
    db.all('SELECT * FROM missions', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Ajouter une nouvelle mission
app.post('/api/missions', (req, res) => {
    console.log('Données reçues pour ajout:', req.body); // Log des données reçues
    const { name, person, objective } = req.body;

    // Vérifiez que les données sont valides
    if (!name || !person || !objective) {
        console.error('Données invalides:', req.body);
        res.status(400).json({ error: 'Tous les champs sont obligatoires.' });
        return;
    }

    db.run(
        'INSERT INTO missions (name, person, objective) VALUES (?, ?, ?)',
        [name, person, objective],
        function (err) {
            if (err) {
                console.error('Erreur lors de l\'ajout de la mission:', err.message);
                res.status(500).json({ error: err.message });
                return;
            }
            console.log('Mission ajoutée avec succès, ID:', this.lastID);
            res.json({ id: this.lastID });
        }
    );
});

// Exporter l'application pour Vercel
module.exports = app;
