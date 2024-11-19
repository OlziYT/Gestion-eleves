// Stockage local
const STORAGE_KEYS = {
    STUDENTS: 'students',
    ADMIN_PASSWORD: 'admin_password'
};

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    // Initialiser le mot de passe admin par défaut si nécessaire
    if (!localStorage.getItem(STORAGE_KEYS.ADMIN_PASSWORD)) {
        // Mot de passe par défaut: 0000
        localStorage.setItem(STORAGE_KEYS.ADMIN_PASSWORD, '0000');
    }

    // Initialiser la liste des élèves si nécessaire
    if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
        localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify([]));
    }

    // Configurer la date maximale
    const dateInput = document.getElementById('date_naissance');
    const today = new Date();
    const minDate = new Date();
    const maxDate = new Date();

    // Âge minimum : 3 ans
    minDate.setFullYear(today.getFullYear() - 20);
    // Âge maximum : 20 ans
    maxDate.setFullYear(today.getFullYear() - 3);

    dateInput.min = minDate.toISOString().split('T')[0];
    dateInput.max = maxDate.toISOString().split('T')[0];

    // Afficher la liste des élèves
    afficherEleves();
});

// Fonctions utilitaires
function calculerAge(dateNaissance) {
    const today = new Date();
    const birthDate = new Date(dateNaissance);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
}

function validerAge(dateNaissance) {
    const age = calculerAge(dateNaissance);
    return age >= 3 && age <= 20;
}

// Gestion des élèves
function ajouterEleve(event) {
    event.preventDefault();

    const nom = document.getElementById('nom').value;
    const prenom = document.getElementById('prenom').value;
    const dateNaissance = document.getElementById('date_naissance').value;

    if (!validerAge(dateNaissance)) {
        alert('L\'âge de l\'élève doit être compris entre 3 et 20 ans.');
        return false;
    }

    const eleves = JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDENTS));
    const nouvelEleve = {
        id: Date.now(),
        nom,
        prenom,
        date_naissance: dateNaissance
    };

    eleves.push(nouvelEleve);
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(eleves));

    document.getElementById('addStudentForm').reset();
    afficherEleves();

    return false;
}

function afficherEleves() {
    const eleves = JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDENTS));
    const container = document.getElementById('studentsList');

    if (eleves.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <svg class="header-icon" style="width: 3rem; height: 3rem; margin-bottom: 1rem;" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M16,13C15.71,13 15.38,13 15.03,13.05C16.19,13.89 17,15 17,16.5V19H23V16.5C23,14.17 18.33,13 16,13M8,13C5.67,13 1,14.17 1,16.5V19H15V16.5C15,14.17 10.33,13 8,13M8,11A3,3 0 0,0 11,8A3,3 0 0,0 8,5A3,3 0 0,0 5,8A3,3 0 0,0 8,11M16,11A3,3 0 0,0 19,8A3,3 0 0,0 16,5A3,3 0 0,0 13,8A3,3 0 0,0 16,11Z"/>
                </svg>
                <p>Aucun élève n'est enregistré pour le moment.</p>
            </div>
        `;
        return;
    }

    const tableHTML = `
        <table>
            <thead>
                <tr>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>Âge</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${eleves.map(eleve => `
                    <tr>
                        <td>${eleve.nom}</td>
                        <td>${eleve.prenom}</td>
                        <td><span class="badge">${calculerAge(eleve.date_naissance)} ans</span></td>
                        <td>
                            <button class="delete-btn" onclick="confirmerSuppression(${eleve.id})" title="Supprimer">
                                <svg class="header-icon" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/>
                                </svg>
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;

    container.innerHTML = tableHTML;
}

// Gestion des modales et actions administrateur
let selectedEleveId = null;

function confirmerSuppression(id) {
    selectedEleveId = id;
    document.getElementById('deleteModal').style.display = 'flex';
    document.getElementById('adminPassword').value = '';
}

function fermerModal() {
    document.getElementById('deleteModal').style.display = 'none';
    document.getElementById('passwordModal').style.display = 'none';
    selectedEleveId = null;
}

function togglePasswordChange() {
    document.getElementById('passwordModal').style.display = 'flex';
}

function supprimerEleve() {
    const password = document.getElementById('adminPassword').value;
    const storedPassword = localStorage.getItem(STORAGE_KEYS.ADMIN_PASSWORD);

    if (password !== storedPassword) {
        alert('Mot de passe incorrect');
        return;
    }

    const eleves = JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDENTS));
    const index = eleves.findIndex(e => e.id === selectedEleveId);
    
    if (index !== -1) {
        eleves.splice(index, 1);
        localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(eleves));
        fermerModal();
        afficherEleves();
    }
}

function changerMotDePasse() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const storedPassword = localStorage.getItem(STORAGE_KEYS.ADMIN_PASSWORD);

    if (!currentPassword || !newPassword) {
        alert('Veuillez remplir tous les champs');
        return;
    }

    if (currentPassword !== storedPassword) {
        alert('Mot de passe actuel incorrect');
        return;
    }

    localStorage.setItem(STORAGE_KEYS.ADMIN_PASSWORD, newPassword);
    alert('Mot de passe changé avec succès');
    fermerModal();
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
}