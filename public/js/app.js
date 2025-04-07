// URL de l'API pour le mode production sur Vercel
const API_BASE_URL = 'https://the-quest-board.vercel.app/api'; // Assurez-vous que cette URL correspond à votre backend déployé

// Déclaration de la variable missions comme tableau global
let missions = [];

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
            .then(data => {
                missions = Array.isArray(data) ? data : []; // S'assurer que missions est un tableau
                missionList.innerHTML = ''; // Réinitialise la liste
                missions.forEach((mission, index) => {
                    createMissionCard(mission, index);
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
            .then(newMission => {
                console.log('Mission ajoutée avec succès.');
                missions.push(newMission); // Ajouter la mission au tableau
                createMissionCard(newMission, missions.length - 1); // Créer une carte pour la nouvelle mission
                newMissionForm.reset();
                $('#missionModal').modal('hide'); // Fermer la popup
            })
            .catch(error => {
                console.error('Erreur lors de l\'ajout de la mission:', error);
                errorMessage.textContent = `Impossible d'ajouter la mission : ${error.message}`;
                errorMessage.style.display = 'block';
            });
    });

    // Fonction pour afficher les missions sous forme de cartes
    function displayMissions() {
        missionList.innerHTML = ""; // Réinitialiser la liste
        missions.forEach((mission, index) => {
            createMissionCard(mission, index);
        });
    }

    // Fonction pour créer une carte de mission
    function createMissionCard(mission, index) {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${mission.name}</h5>
            </div>
        `;
        card.addEventListener("click", () => showMissionDetails(mission));
        missionList.appendChild(card);
    }

    // Fonction pour afficher les détails d'une mission dans la modale
    function showMissionDetails(mission) {
        document.getElementById("detailMissionName").textContent = mission.name;
        document.getElementById("detailMissionPerson").textContent = mission.person;
        document.getElementById("detailMissionObjective").textContent = mission.objective;

        // Ajouter les actions pour les boutons
        const completeButton = document.getElementById("completeMissionButton");
        const deleteButton = document.getElementById("deleteMissionButton");

        completeButton.onclick = () => {
            markMissionAsCompleted(mission);
            $("#missionDetailsModal").modal("hide");
        };

        deleteButton.onclick = () => {
            if (confirm(`Êtes-vous sûr de vouloir supprimer la mission "${mission.name}" ?`)) {
                deleteMission(mission);
                $("#missionDetailsModal").modal("hide");
            }
        };

        $("#missionDetailsModal").modal("show");
    }

    // Fonction pour marquer une mission comme accomplie
    function markMissionAsCompleted(mission) {
        fetch(`${API_BASE_URL}/missions/${mission.id}/complete`, {
            method: 'PATCH', // Utilisation de PATCH pour mettre à jour l'état de la mission
            headers: { 'Content-Type': 'application/json' },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                console.log(`Mission "${mission.name}" marquée comme accomplie.`);
                loadMissions(); // Recharger les missions après mise à jour
            })
            .catch(error => {
                console.error('Erreur lors de la mise à jour de la mission:', error);
                alert(`Impossible de marquer la mission comme accomplie : ${error.message}`);
            });
    }

    // Fonction pour supprimer une mission
    function deleteMission(mission) {
        fetch(`${API_BASE_URL}/missions/${mission.id}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                console.log(`Mission "${mission.name}" supprimée avec succès.`);
                loadMissions(); // Recharger les missions après suppression
            })
            .catch(error => {
                console.error('Erreur lors de la suppression de la mission:', error);
                alert(`Impossible de supprimer la mission : ${error.message}`);
            });
    }

    // S'assurer que les missions sont affichées après le chargement de la page
    displayMissions();

    // Charger les missions au démarrage
    loadMissions();
});