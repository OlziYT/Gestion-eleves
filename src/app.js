import { getEleves, ajouterEleve, supprimerEleve, verifierMotDePasse, changerMotDePasse } from './database.js';

export function createApp() {
  let selectedEleveId = null;

  async function loadEleves() {
    try {
      const eleves = await getEleves();
      const elevesWithAge = eleves.map(eleve => {
        const dateNaissance = new Date(eleve.date_naissance);
        const aujourdhui = new Date();
        const age = aujourdhui.getFullYear() - dateNaissance.getFullYear();
        return { ...eleve, age };
      });

      renderEleves(elevesWithAge);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors du chargement des élèves');
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    try {
      await ajouterEleve(data.nom, data.prenom, data.date_naissance);
      await loadEleves();
      event.target.reset();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'ajout de l\'élève');
    }
  }

  async function handleDelete(id, password) {
    try {
      const isValid = await verifierMotDePasse(password);
      if (!isValid) {
        alert('Mot de passe incorrect');
        return;
      }

      await supprimerEleve(id);
      await loadEleves();
      closeModal('deleteModal');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
    }
  }

  async function handlePasswordChange(currentPassword, newPassword) {
    try {
      const isValid = await verifierMotDePasse(currentPassword);
      if (!isValid) {
        alert('Mot de passe actuel incorrect');
        return;
      }

      await changerMotDePasse(newPassword);
      alert('Mot de passe changé avec succès');
      closeModal('passwordModal');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors du changement de mot de passe');
    }
  }

  function openModal(modalId, id = null) {
    selectedEleveId = id;
    document.getElementById(modalId).style.display = 'flex';
  }

  function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    selectedEleveId = null;
  }

  // Initial load
  loadEleves();

  return `
    <div class="container">
      <div class="card">
        <div class="header-with-actions">
          <h1>Gestion des élèves</h1>
          <button onclick="window.app.openModal('passwordModal')" class="settings-btn" title="Paramètres administrateur">
            <svg class="header-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/>
            </svg>
          </button>
        </div>

        <form id="ajoutForm" onsubmit="window.app.handleSubmit(event)">
          <!-- Form content remains the same -->
        </form>
      </div>

      <div id="elevesList" class="card">
        <!-- Eleves list will be rendered here -->
      </div>

      <!-- Modals remain the same -->
    </div>
  `;
}