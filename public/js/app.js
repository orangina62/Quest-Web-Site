// URL de l'API pour le mode production sur Vercel
const API_BASE_URL = 'https://votre-backend-vercel.vercel.app'; // Remplacez par l'URL de votre backend déployé

document.addEventListener('DOMContentLoaded', () => {
    const newMissionForm = document.getElementById('newMissionForm');
    const missionList = document.getElementById('missionList');
    const errorMessage = document.getElementById('errorMessage');

    // Charger les missions depuis le backend
    function loadMissions() {
        fetch(`${API_BASE_URL}/missions`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(missions => {
                missionList.innerHTML = ''; // Réinitialise la liste
                missions.forEach(mission => {
                    const missionItem = document.createElement('li');
                    missionItem.textContent = `Mission: ${mission.name}, Personne: ${mission.person}, Objectif: ${mission.objective}`;
                    missionList.appendChild(missionItem);
                });
            })
            .catch(error => {
                console.error('Erreur lors du chargement des missions:', error);
                errorMessage.textContent = 'Impossible de charger les missions. Vérifiez que le backend est accessible.';
                errorMessage.style.display = 'block';
            });
    }

    // Ajouter une mission via le backend
    newMissionForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const missionName = document.getElementById('missionName').value.trim();
        const missionPerson = document.getElementById('missionPerson').value.trim();
        const missionObjective = document.getElementById('missionObjective').value.trim();

        // Validation des champs
        if (!missionName || !missionPerson || !missionObjective) {
            errorMessage.textContent = 'Tous les champs sont obligatoires.';
            errorMessage.style.display = 'block';
            return;
        }

        // Envoyer la mission au backend
        fetch(`${API_BASE_URL}/missions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: missionName, person: missionPerson, objective: missionObjective })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(() => {
                console.log('Mission ajoutée avec succès.');
                loadMissions(); // Recharger les missions après l'ajout
                newMissionForm.reset();
                $('#missionModal').modal('hide'); // Fermer la popup
            })
            .catch(error => {
                console.error('Erreur lors de l\'ajout de la mission:', error);
                errorMessage.textContent = `Impossible d'ajouter la mission : ${error.message}`;
                errorMessage.style.display = 'block';
            });
    });

    // Charger les missions au démarrage
    loadMissions();
});