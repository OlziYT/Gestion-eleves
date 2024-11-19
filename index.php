<?php
// Configuration de la base de données
$host = 'localhost';
$dbname = 'school_db';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    echo "Erreur de connexion : " . $e->getMessage();
    die();
}

// Traitement du formulaire
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nom = $_POST['nom'];
    $prenom = $_POST['prenom'];
    $date_naissance = $_POST['date_naissance'];
    
    $sql = "INSERT INTO eleves (nom, prenom, date_naissance) VALUES (?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$nom, $prenom, $date_naissance]);
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Gestion des élèves</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .container { max-width: 800px; margin: 0 auto; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; }
        input { padding: 5px; width: 200px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
        th { background-color: #f5f5f5; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Gestion des élèves</h1>
        
        <h2>Ajouter un élève</h2>
        <form method="POST">
            <div class="form-group">
                <label for="nom">Nom :</label>
                <input type="text" id="nom" name="nom" required>
            </div>
            
            <div class="form-group">
                <label for="prenom">Prénom :</label>
                <input type="text" id="prenom" name="prenom" required>
            </div>
            
            <div class="form-group">
                <label for="date_naissance">Date de naissance :</label>
                <input type="date" id="date_naissance" name="date_naissance" required>
            </div>
            
            <button type="submit">Enregistrer</button>
        </form>
        
        <h2>Liste des élèves</h2>
        <table>
            <thead>
                <tr>
                    <th>Nom</th>
                    <th>Prénom</th>
                    <th>Âge</th>
                </tr>
            </thead>
            <tbody>
                <?php
                $sql = "SELECT nom, prenom, date_naissance FROM eleves ORDER BY nom, prenom";
                $stmt = $pdo->query($sql);
                
                while ($row = $stmt->fetch()) {
                    $date_naissance = new DateTime($row['date_naissance']);
                    $aujourd_hui = new DateTime();
                    $age = $aujourd_hui->diff($date_naissance)->y;
                    
                    echo "<tr>";
                    echo "<td>" . htmlspecialchars($row['nom']) . "</td>";
                    echo "<td>" . htmlspecialchars($row['prenom']) . "</td>";
                    echo "<td>" . $age . " ans</td>";
                    echo "</tr>";
                }
                ?>
            </tbody>
        </table>
    </div>
</body>
</html>