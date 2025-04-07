const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const db = new sqlite3.Database('./missions.db');

// Middleware
app.use(express.json());
app.use(cors({
    origin: '*', // Autorise toutes les origines
    methods: ['GET', 'POST'], // Autorise uniquement les méthodes GET et POST
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
app.get('/missions', (req, res) => {
    console.log('Requête reçue pour récupérer les missions.');
    db.all('SELECT * FROM missions', [], (err, rows) => {
        if (err) {
            console.error('Erreur lors de la récupération des missions:', err.message);
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Ajouter une nouvelle mission
app.post('/missions', (req, res) => {
    console.log('Requête POST reçue pour ajouter une mission:', req.body);
    const { name, person, objective } = req.body;

    // Vérifiez que les données sont valides
    if (!name || !person || !objective) {
        console.error('Données invalides reçues:', req.body);
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

// Démarrer le serveur
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
    console.log('Assurez-vous que ce port est accessible et non utilisé par une autre application.');
});
