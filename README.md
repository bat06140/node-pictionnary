## Projet Pictionnary en NodeJs
Auteur : Elbaz Jérémie
Promo : LPSIL IDSE

## Installation
##### La base de donnée
Créer une base de donnée avec le nom de `pictionnary`
Entrez les lignes suivantes :
```
CREATE USER 'test'@'localhost' IDENTIFIED BY  'test';  
GRANT USAGE ON * . * TO  'test'@'localhost' IDENTIFIED BY  'test';  
GRANT ALL PRIVILEGES ON  `pictionnary` . * TO  'test'@'localhost';
```

Exécutez ensuite le script `pictionnary.sql` dans la BDD

##### Les modules
Pour installer les modules, mettez vous à la racine du projet puis tapez en ligne de commande : 
`npm install`

## Fonctionnalité
- Connexion Facebook / Local
- Déconnexion
- Paint
- Guess
- Inscription
- Panneau admin
- Modification profil