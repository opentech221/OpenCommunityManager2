# Guide de Test - Module Finances Backend/Frontend

## 🎯 Objectif
Valider l'intégration complète du module finances entre le backend Flask et le frontend React.

## 📋 Prérequis
- Python avec Flask installé
- Node.js avec les dépendances npm installées
- Base de données initialisée

## 🚀 Étapes de Test

### 1. Préparation
```bash
# Naviguer vers le dossier du projet
cd c:\Users\toshiba\Downloads\zzz\OpenCommunityManager2

# Initialiser la base de données
cd backend
python setup_db.py

# Vérifier les imports
python test_imports.py
```

### 2. Démarrage du Backend
```bash
# Dans le dossier backend
python run.py
```
✅ **Attendu**: Serveur Flask démarré sur http://localhost:5000

### 3. Démarrage du Frontend
```bash
# Dans le dossier racine
npm run dev
```
✅ **Attendu**: Serveur Vite démarré sur http://localhost:5173

### 4. Tests d'API avec Script
```bash
# Dans le dossier backend (avec serveur actif)
python test_finances_api.py
```
✅ **Attendu**: Tous les tests CRUD passent avec succès

### 5. Tests Frontend
1. **Navigation**: Aller sur http://localhost:5173
2. **Connexion**: Email `test@asso.com`, mot de passe `test123`
3. **Module Finances**: Cliquer sur "Finances" dans la sidebar
4. **Fonctionnalités à tester**:
   - ✅ Affichage des transactions existantes
   - ✅ Création d'une nouvelle transaction
   - ✅ Modification d'une transaction
   - ✅ Suppression d'une transaction
   - ✅ Filtrage par type (Recettes/Dépenses)
   - ✅ Statistiques en temps réel

## 🔍 Points de Validation

### Backend API
- [ ] GET `/api/finances` - Liste des transactions
- [ ] POST `/api/finances` - Création d'une transaction
- [ ] PUT `/api/finances/{id}` - Modification d'une transaction
- [ ] DELETE `/api/finances/{id}` - Suppression d'une transaction
- [ ] GET `/api/finances/stats` - Statistiques financières
- [ ] GET `/api/finances/categories` - Liste des catégories

### Frontend Integration
- [ ] Hook `useFinances` fonctionne correctement
- [ ] Service `financeAPI` communique avec le backend
- [ ] Interface utilisateur réactive aux changements
- [ ] Gestion des erreurs et états de chargement
- [ ] Synchronisation en temps réel avec les données backend

### Workflow CRUD Complet
1. **Create**: Ajouter une nouvelle transaction via l'interface
2. **Read**: Voir la transaction apparaître dans la liste
3. **Update**: Modifier la transaction et voir les changements
4. **Delete**: Supprimer la transaction et voir la mise à jour

## 🐛 Résolution de Problèmes

### Backend ne démarre pas
- Vérifier l'installation des dépendances: `pip install -r requirements.txt`
- Vérifier la base de données: `python setup_db.py`

### Frontend ne charge pas les données
- Vérifier que le backend est actif sur le port 5000
- Vérifier la console du navigateur pour les erreurs CORS
- Vérifier les tokens d'authentification

### Erreurs de compilation TypeScript
- Vérifier que tous les types sont correctement importés
- Relancer le serveur de développement

## 📊 Résultats Attendus
- ✅ API backend fonctionnelle avec tous les endpoints
- ✅ Interface frontend connectée aux vraies données
- ✅ CRUD complet opérationnel
- ✅ Synchronisation temps réel
- ✅ Gestion des erreurs robuste

## 🎉 Validation Finale
Une fois tous les tests passés, le module finances est complètement intégré et prêt pour la production.
