# Pré-requis

Ce programme nécessite une version Node.js >= 18 (avec support de l'API Fetch)

# Lancement du programme

Se placer à la racine du projet, puis:

```
npm run build && npm run start
```

## Docker

Construire l'image:

```
docker build -t bcm-backend-interview .
```

Lancer le container:

```
docker run --name bcm-backend-interview bcm-backend-interview
```

# Reste à faire

- Gérer les centrales qui renvoient des données au format csv
- Améliorer la gestion des erreurs
- Compléter les tests
- ...
