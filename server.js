import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { engine } from 'express-handlebars';
import { getEleves, ajouterEleve, supprimerEleve, verifierMotDePasse, changerMotDePasse } from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

// Configuration de Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.get('/', async (req, res) => {
  try {
    const eleves = await getEleves();
    
    // Calcul de l'âge pour chaque élève
    const elevesAvecAge = eleves.map(eleve => {
      const dateNaissance = new Date(eleve.date_naissance);
      const aujourdhui = new Date();
      const age = aujourdhui.getFullYear() - dateNaissance.getFullYear();
      return { ...eleve, age };
    });

    res.render('home', { eleves: elevesAvecAge });
  } catch (error) {
    console.error('Erreur lors de la récupération des élèves:', error);
    res.status(500).send('Erreur serveur');
  }
});

app.post('/ajouter', async (req, res) => {
  try {
    const { nom, prenom, date_naissance } = req.body;
    await ajouterEleve(nom, prenom, date_naissance);
    res.redirect('/');
  } catch (error) {
    console.error('Erreur lors de l\'ajout d\'un élève:', error);
    res.status(500).send('Erreur serveur');
  }
});

app.post('/supprimer', async (req, res) => {
  try {
    const { id, password } = req.body;
    const isValidPassword = await verifierMotDePasse(password);
    
    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Mot de passe incorrect' });
    }

    await supprimerEleve(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

app.post('/changer-mot-de-passe', async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const isValidPassword = await verifierMotDePasse(currentPassword);
    
    if (!isValidPassword) {
      return res.status(401).json({ success: false, message: 'Mot de passe actuel incorrect' });
    }

    await changerMotDePasse(newPassword);
    res.json({ success: true });
  } catch (error) {
    console.error('Erreur lors du changement de mot de passe:', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
  console.log('Les données sont sauvegardées dans database.sqlite');
});