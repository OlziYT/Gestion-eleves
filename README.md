# Système de Gestion des Élèves

Une application Node.js pour la gestion des dossiers d'élèves avec Express et SQLite.

## Prérequis

**Node.js**
- Téléchargez et installez Node.js depuis [https://nodejs.org/](https://nodejs.org/)
- **Important** : Lors de l'installation, cochez la case "Automatically install the necessary tools" pour installer Chocolatey et les outils nécessaires
- Cette étape peut prendre plusieurs minutes car elle installe également Python et Visual Studio Build Tools
- Node.js (version 14 ou supérieure)
- npm (inclus avec Node.js)


## Installation

1. Naviguer vers le répertoire du projet :
```bash
cd "target location ex : C:\Users\pc\Downloads\project"
```

2. Installer les dépendances :
```bash
npm install
```

## Lancement de l'Application

Démarrer le serveur :
```bash
npm start
```

L'application sera accessible à l'adresse `http://localhost:3000`

## Fonctionnalités

- Ajout de nouveaux élèves avec leurs informations personnelles
- Visualisation de la liste de tous les élèves avec leurs âges
- Suppression d'élèves (protégée par mot de passe)
- Modification du mot de passe administrateur
- Interface moderne avec thème sombre
- Design responsive

## Mot de Passe par Défaut

Le mot de passe par défaut pour la suppression d'élèves est : `0000`

## Base de Données

L'application utilise SQLite comme base de données, stockée dans le fichier `database.sqlite`. La base de données est automatiquement créée lors du premier lancement de l'application.

## Structure du Projet

- `server.js` - Fichier principal de l'application
- `database.js` - Configuration et requêtes de la base de données
- `views/` - Templates Handlebars
  - `home.handlebars` - Template de la page principale
  - `layouts/main.handlebars` - Template du layout
