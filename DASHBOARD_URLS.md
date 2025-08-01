# 🎯 Guide d'Accès aux Tableaux de Bord

## URLs Principales

### Tableau de Bord Principal
- **URL** : http://localhost:5173
- **Description** : Page d'accueil avec vue d'ensemble

### Modules Fonctionnels
- **Finances** : http://localhost:5173/finances
  - Gestion des transactions, cotisations, factures
  - Graphiques de revenus et dépenses
  
- **Membres** : http://localhost:5173/members
  - Liste des membres, ajout/modification
  - Gestion des statuts d'adhésion
  
- **Événements** : http://localhost:5173/events
  - Calendrier des événements
  - Gestion des participants
  
- **Messages** : http://localhost:5173/messages
  - Communication interne
  - Notifications
  
- **Documents** : http://localhost:5173/documents
  - Bibliothèque de documents
  - Partage de fichiers

### APIs Backend (pour développement)
- **API Base** : http://localhost:5000/api
- **Health Check** : http://localhost:5000/api/health
- **Finances API** : http://localhost:5000/api/finances
- **Members API** : http://localhost:5000/api/members

### Monitoring (en développement)
- **Prometheus** : http://localhost:9090
- **Grafana** : http://localhost:3000

## Instructions d'Utilisation

1. **Démarrage** : Utilisez `launch-system.bat`
2. **Accès** : Ouvrez http://localhost:5173 dans votre navigateur
3. **Navigation** : Utilisez la sidebar pour changer de module
4. **Tests** : Chaque module a des fonctionnalités interactives

## Fonctionnalités Optimisées

✅ **Tests** : 100% de réussite (56/56 tests)
✅ **Performance** : Bundle optimisé à 236KB (-66.5%)
✅ **CI/CD** : Pipeline GitHub Actions complet
✅ **Architecture** : Code splitting et lazy loading

## Support

- **Documentation** : Dossier `/docs`
- **Tests** : `npm run test`
- **Build** : `npm run build`
