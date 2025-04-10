# The Quest Board

Bienvenue sur **The Quest Board**, une application web simple permettant de gérer des missions. Ce projet utilise un backend Express avec une base de données SQLite et un frontend déployé sur Vercel.

---

## 🚀 Fonctionnalités

- **Liste des missions** : Affiche toutes les missions disponibles.
- **Ajout de missions** : Permet d'ajouter de nouvelles missions via un formulaire interactif.
- **Backend Express** : Gestion des données avec une base SQLite.
- **Déploiement facile** : Optimisé pour être déployé sur [Vercel](https://vercel.com).

---

## 📂 Structure du projet

```
The Quest Board
├── public
│   ├── index.html         # Page principale
│   ├── css
│   │   └── style.css      # Styles CSS
│   └── js
│       └── app.js         # Logique frontend
├── server.js              # Backend Express
├── missions.db            # Base de données SQLite
├── package.json           # Configuration npm
├── vercel.json            # Configuration de déploiement Vercel
└── README.md              # Documentation du projet
```

---

## 🛠️ Installation et utilisation

### Prérequis

- [Node.js](https://nodejs.org/) installé sur votre machine.
- [npm](https://www.npmjs.com/) pour gérer les dépendances.

### Étapes d'installation

1. Clonez le dépôt :
   ```bash
   git clone https://github.com/orangina62/Quest-Web-Site.git
   cd Quest-Web-Site
   ```

2. Installez les dépendances :
   ```bash
   npm install
   ```

3. Lancez le serveur backend :
   ```bash
   node server.js
   ```

4. Lancez le serveur frontend (optionnel pour développement local) :
   ```bash
   npm start
   ```

5. Accédez à l'application :
   - Backend : [http://localhost:3000](http://localhost:3000)
   - Frontend : [http://127.0.0.1:8080](http://127.0.0.1:8080) (via `live-server`)

---

## 🌐 Déploiement sur Vercel

1. Installez le CLI Vercel :
   ```bash
   npm install -g vercel
   ```

2. Déployez le projet :
   ```bash
   vercel --prod
   ```

3. Suivez les instructions pour finaliser le déploiement.

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Suivez ces étapes pour contribuer :

1. Forkez le projet.
2. Créez une branche pour vos modifications :
   ```bash
   git checkout -b feature/ma-nouvelle-fonctionnalite
   ```
3. Commitez vos modifications :
   ```bash
   git commit -m "Ajout d'une nouvelle fonctionnalité"
   ```
4. Poussez vos modifications :
   ```bash
   git push origin feature/ma-nouvelle-fonctionnalite
   ```
5. Ouvrez une Pull Request.

---

## 📜 Licence

Ce projet est sous licence MIT. Consultez le fichier [LICENSE](LICENSE) pour plus d'informations.

---

## 📧 Contact

Pour toute question ou suggestion, contactez-moi via [GitHub](https://github.com/orangina62).