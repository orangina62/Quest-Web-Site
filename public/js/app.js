// URL de l'API pour le mode production sur Vercel
const API_BASE_URL = 'https://the-quest-board.vercel.app/api'; // Assurez-vous que cette URL correspond à votre backend déployé

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
                console.log(data); // Log pour vérifier les données des missions
                missionList.innerHTML = ''; // Réinitialise la liste
                data.forEach((mission) => {
                    createMissionCard(mission);
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
                newMissionForm.reset();
                $('#missionModal').modal('hide'); // Fermer la popup
                loadMissions(); // Recharger les missions depuis l'API
            })
            .catch(error => {
                console.error('Erreur lors de l\'ajout de la mission:', error);
                errorMessage.textContent = `Impossible d'ajouter la mission : ${error.message}`;
                errorMessage.style.display = 'block';
            });
    });

    // Fonction pour créer une carte de mission
    function createMissionCard(mission) {
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
        console.log(`Tentative de marquer la mission comme accomplie :`, mission); // Log pour vérifier la mission
        fetch(`${API_BASE_URL}/missions/${mission.id}`, {
            method: 'PATCH', // Utilisation de PATCH pour mettre à jour l'état de la mission
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: true }) // Envoi d'un indicateur pour marquer comme accompli
        })
            .then(response => {
                console.log(`Réponse du serveur :`, response); // Log pour vérifier la réponse
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log(`Mission mise à jour avec succès :`, data); // Log pour vérifier les données mises à jour
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

    // Charger les missions au démarrage
    loadMissions();
});