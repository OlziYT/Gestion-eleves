import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import bcrypt from 'bcryptjs';

const db = new sqlite3.Database('database.sqlite');

// Promisify database methods
const runAsync = promisify(db.run.bind(db));
const allAsync = promisify(db.all.bind(db));
const getAsync = promisify(db.get.bind(db));

// Création des tables
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS eleves (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nom TEXT NOT NULL,
      prenom TEXT NOT NULL,
      date_naissance DATE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  db.run(`
    CREATE TABLE IF NOT EXISTS admin_password (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      password TEXT NOT NULL
    )
  `);

  // Insert default admin password (0000) if not exists
  db.get("SELECT * FROM admin_password LIMIT 1", async (err, row) => {
    if (!row) {
      const hashedPassword = await bcrypt.hash('0000', 10);
      db.run("INSERT INTO admin_password (password) VALUES (?)", [hashedPassword]);
    }
  });
});

export const getEleves = () => {
  return allAsync('SELECT id, nom, prenom, date_naissance FROM eleves ORDER BY nom, prenom');
};

export const ajouterEleve = (nom, prenom, date_naissance) => {
  return runAsync('INSERT INTO eleves (nom, prenom, date_naissance) VALUES (?, ?, ?)', 
    [nom, prenom, date_naissance]);
};

export const supprimerEleve = (id) => {
  return runAsync('DELETE FROM eleves WHERE id = ?', [id]);
};

export const verifierMotDePasse = async (password) => {
  const row = await getAsync('SELECT password FROM admin_password LIMIT 1');
  return bcrypt.compare(password, row.password);
};

export const changerMotDePasse = async (newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  return runAsync('UPDATE admin_password SET password = ? WHERE id = 1', [hashedPassword]);
};